#!/usr/bin/env node

import { execSync } from "node:child_process"
import { mkdtemp, rm } from "node:fs/promises"
import os from "node:os"
import path from "node:path"

const args = process.argv.slice(2)
const command = ["pnpm", "dlx", "codemod", "pnpm/catalog", ...args]
  .map(quoteArg)
  .join(" ")

const registry = "https://registry.npmjs.org"

console.log("🔄 Running pnpm catalog migration with the official codemod...")

main().catch((err) => {
  console.error("❌ Catalog migration failed.")
  if (err && typeof err === 'object' && 'status' in err) {
    // execSync 抛出的错误，子进程的错误信息已经通过 stdio: "inherit" 打印了
    // 这里只需透传状态码
    process.exit(err.status ?? 1)
  } else {
    // 意外的 JS 运行时错误
    console.error(err)
    process.exit(1)
  }
})

async function main() {
  const npmCacheDir = await mkdtemp(path.join(os.tmpdir(), "loom-npm-cache-"))

  try {
    execSync(command, {
      stdio: "inherit",
      env: {
        ...process.env,
        NPM_CONFIG_REGISTRY: registry,
        NPM_CONFIG_CACHE: npmCacheDir,
        npm_config_registry: registry,
        npm_config_cache: npmCacheDir,
      },
    })
  } finally {
    await rm(npmCacheDir, { recursive: true, force: true }).catch((err) => {
      console.warn(`⚠️ Failed to clean up temporary npm cache at ${npmCacheDir}:`, err.message)
    })
  }
}

function quoteArg(arg) {
  if (/^[A-Za-z0-9_./:=@-]+$/.test(arg)) {
    return arg
  }

  return JSON.stringify(arg)
}
