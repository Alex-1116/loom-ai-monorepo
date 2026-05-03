#!/usr/bin/env node

import { access, readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const ROOT_DIR = process.cwd()
const WORKSPACE_FILE = path.join(ROOT_DIR, "pnpm-workspace.yaml")
const ROOT_PACKAGE_FILE = path.join(ROOT_DIR, "package.json")
const DEPENDENCY_FIELDS = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
]
const args = new Set(process.argv.slice(2))
const isCheckMode = args.has("--check")
const isDryRun = args.has("--dry-run")
const shouldWrite = !isCheckMode && !isDryRun

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})

async function main() {
  const workspaceContent = await readFile(WORKSPACE_FILE, "utf8")
  const workspacePatterns = parseWorkspacePatterns(workspaceContent)

  if (workspacePatterns.length === 0) {
    throw new Error("No workspace package patterns found in pnpm-workspace.yaml")
  }

  const packageFiles = [
    ROOT_PACKAGE_FILE,
    ...(await resolveWorkspacePackageFiles(workspacePatterns)),
  ]
  const catalog = parseCatalog(workspaceContent)
  const nextCatalog = new Map(catalog)
  const packageWrites = []
  const migratedEntries = []
  const addedCatalogEntries = []
  const conflicts = []

  for (const packageFile of packageFiles) {
    const packageContent = await readFile(packageFile, "utf8")
    const packageJson = JSON.parse(packageContent)
    const relativePackageFile = path.relative(ROOT_DIR, packageFile) || "package.json"
    let changed = false

    for (const field of DEPENDENCY_FIELDS) {
      const deps = packageJson[field]

      if (!deps || typeof deps !== "object") {
        continue
      }

      for (const [dependencyName, rawSpec] of Object.entries(deps)) {
        if (!shouldMigrateDependency(rawSpec)) {
          continue
        }

        const spec = String(rawSpec)
        const existingCatalogVersion = nextCatalog.get(dependencyName)

        if (existingCatalogVersion && existingCatalogVersion !== spec) {
          conflicts.push({
            dependencyName,
            file: relativePackageFile,
            field,
            existingCatalogVersion,
            packageVersion: spec,
          })
          continue
        }

        if (!existingCatalogVersion) {
          nextCatalog.set(dependencyName, spec)
          addedCatalogEntries.push(`${dependencyName}@${spec}`)
        }

        if (deps[dependencyName] !== "catalog:") {
          deps[dependencyName] = "catalog:"
          changed = true
          migratedEntries.push(`${relativePackageFile} -> ${field}.${dependencyName}`)
        }
      }
    }

    if (changed) {
      packageWrites.push({
        filePath: packageFile,
        content: `${JSON.stringify(packageJson, null, 2)}\n`,
      })
    }
  }

  if (conflicts.length > 0) {
    const details = conflicts
      .map(
        (conflict) =>
          `- ${conflict.dependencyName}: catalog=${conflict.existingCatalogVersion}, ${conflict.file} (${conflict.field})=${conflict.packageVersion}`,
      )
      .join("\n")

    throw new Error(
      [
        "Found version conflicts while migrating dependencies to catalog.",
        "Resolve the conflicting versions first, then rerun the script.",
        details,
      ].join("\n"),
    )
  }

  const nextWorkspaceContent = updateCatalogBlock(workspaceContent, nextCatalog)
  const workspaceChanged = nextWorkspaceContent !== workspaceContent

  if (isCheckMode || isDryRun) {
    printSummary({
      migratedEntries,
      addedCatalogEntries,
      workspaceChanged,
      writeMode: false,
    })

    if (isCheckMode && (migratedEntries.length > 0 || workspaceChanged)) {
      process.exitCode = 1
    }

    return
  }

  if (workspaceChanged) {
    await writeFile(WORKSPACE_FILE, nextWorkspaceContent, "utf8")
  }

  await Promise.all(
    packageWrites.map(({ filePath, content }) => writeFile(filePath, content, "utf8")),
  )

  printSummary({
    migratedEntries,
    addedCatalogEntries,
    workspaceChanged,
    writeMode: shouldWrite,
  })
}

function shouldMigrateDependency(spec) {
  if (typeof spec !== "string") {
    return false
  }

  if (
    spec === "catalog:" ||
    spec.startsWith("workspace:") ||
    spec.startsWith("file:") ||
    spec.startsWith("link:") ||
    spec.startsWith("portal:") ||
    spec.startsWith("patch:")
  ) {
    return false
  }

  // Skip git/http/npm alias style specs to avoid mutating non-standard sources.
  return !/^[a-z]+:/i.test(spec)
}

function parseWorkspacePatterns(content) {
  const block = getYamlBlock(content, "packages")
  const patterns = []

  for (const line of block) {
    const match = line.match(/^\s*-\s+"?([^"]+)"?\s*$/)
    if (match) {
      patterns.push(match[1])
    }
  }

  return patterns
}

function parseCatalog(content) {
  const block = getYamlBlock(content, "catalog")
  const catalog = new Map()

  for (const line of block) {
    const match = line.match(/^\s+(?:"([^"]+)"|([^:]+)):\s+(.+)\s*$/)

    if (!match) {
      continue
    }

    const key = (match[1] ?? match[2]).trim()
    const value = stripQuotes(match[3].trim())
    catalog.set(key, value)
  }

  return catalog
}

function getYamlBlock(content, blockName) {
  const lines = content.split("\n")
  const start = lines.findIndex((line) => line.trim() === `${blockName}:`)

  if (start === -1) {
    return []
  }

  const block = []

  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index]

    if (!line.startsWith("  ")) {
      break
    }

    block.push(line)
  }

  return block
}

async function resolveWorkspacePackageFiles(patterns) {
  const files = new Set()

  for (const pattern of patterns) {
    if (pattern.endsWith("/*")) {
      const baseDir = path.join(ROOT_DIR, pattern.slice(0, -2))
      const entries = await readdir(baseDir, { withFileTypes: true })

      for (const entry of entries) {
        if (!entry.isDirectory()) {
          continue
        }

        const packageFile = path.join(baseDir, entry.name, "package.json")

        if (await fileExists(packageFile)) {
          files.add(packageFile)
        }
      }

      continue
    }

    if (pattern.includes("*")) {
      throw new Error(`Unsupported workspace pattern: ${pattern}`)
    }

    const packageFile = path.join(ROOT_DIR, pattern, "package.json")

    if (await fileExists(packageFile)) {
      files.add(packageFile)
    }
  }

  return [...files]
}

function updateCatalogBlock(content, catalogEntries) {
  const lines = content.split("\n")
  const start = lines.findIndex((line) => line.trim() === "catalog:")
  const catalogLines = buildCatalogLines(catalogEntries)

  if (start === -1) {
    const nextLines = [...trimTrailingEmptyLines(lines)]

    if (nextLines.length > 0) {
      nextLines.push("")
    }

    nextLines.push(...catalogLines)
    return `${nextLines.join("\n")}\n`
  }

  let end = start + 1

  while (end < lines.length && lines[end].startsWith("  ")) {
    end += 1
  }

  const nextLines = [...lines.slice(0, start), ...catalogLines, ...lines.slice(end)]
  return `${trimTrailingEmptyLines(nextLines).join("\n")}\n`
}

function buildCatalogLines(catalogEntries) {
  const lines = ["catalog:"]
  const sortedEntries = [...catalogEntries.entries()].sort(([left], [right]) =>
    left.localeCompare(right),
  )

  for (const [name, version] of sortedEntries) {
    lines.push(`  ${formatYamlKey(name)}: ${JSON.stringify(version)}`)
  }

  return lines
}

function formatYamlKey(name) {
  if (/^[A-Za-z0-9_-]+$/.test(name)) {
    return name
  }

  return JSON.stringify(name)
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

function trimTrailingEmptyLines(lines) {
  const nextLines = [...lines]

  while (nextLines.length > 0 && nextLines.at(-1) === "") {
    nextLines.pop()
  }

  return nextLines
}

function printSummary({
  migratedEntries,
  addedCatalogEntries,
  workspaceChanged,
  writeMode,
}) {
  const modeLabel = writeMode ? "Updated" : "Checked"
  const packageCount = new Set(migratedEntries.map((entry) => entry.split(" -> ")[0])).size

  console.log(`${modeLabel} pnpm catalog migration.`)
  console.log(`- migrated dependency entries: ${migratedEntries.length}`)
  console.log(`- affected package.json files: ${packageCount}`)
  console.log(`- new catalog entries: ${addedCatalogEntries.length}`)
  console.log(`- pnpm-workspace.yaml changed: ${workspaceChanged ? "yes" : "no"}`)

  if (migratedEntries.length === 0 && !workspaceChanged) {
    console.log("No changes were required.")
  }
}

async function fileExists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}
