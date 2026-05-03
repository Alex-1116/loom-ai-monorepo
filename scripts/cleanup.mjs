#!/usr/bin/env node

import { promises as fs } from "node:fs"
import { join } from "node:path"

const rootDir = process.cwd()

// 控制并发数量，避免创建过多的并发任务
const CONCURRENCY_LIMIT = 10

// 需要跳过的名称，避免进入这些目录或处理这些文件
const SKIP_NAMES = new Set([
  ".DS_Store",
  ".git",
  ".idea",
  ".agents",
  ".trae",
  ".husky",
  ".vscode",
])

/**
 * 处理单个文件/目录项
 * @param {string} currentDir - 当前目录路径
 * @param {import('node:fs').Dirent} dirent - 文件/目录项
 * @param {Set<string>} targets - 要删除的目标集合
 * @returns {Promise<string | null>} - 返回需要继续遍历的子目录路径
 */
async function processItem(currentDir, dirent, targets) {
  const item = dirent.name

  // 跳过特殊目录或文件
  if (SKIP_NAMES.has(item)) {
    return null
  }

  try {
    const itemPath = join(currentDir, item)

    if (targets.has(item)) {
      // 匹配到目标目录或文件时直接删除
      await fs.rm(itemPath, { force: true, recursive: true })
      console.log(`✅ Deleted: ${itemPath}`)
      return null
    }

    return dirent.isDirectory() ? itemPath : null
  } catch (error) {
    if (error.code === "ENOENT") {
      return null
    } else if (error.code === "EPERM" || error.code === "EACCES") {
      console.error(`❌ Permission denied: ${item} in ${currentDir}`)
    } else {
      console.error(
        `❌ Error handling item ${item} in ${currentDir}: ${error.message}`
      )
    }
    return null
  }
}

/**
 * 使用全局工作队列查找并删除目标目录/文件，确保并发在全局范围内受控
 * @param {string} startDir - 起始目录
 * @param {Set<string>} targets - 要删除的目标集合
 */
async function cleanTargets(startDir, targets) {
  const queue = [startDir]
  let queueIndex = 0
  const waiters = []
  let pendingDirs = 1

  const wakeWorkers = () => {
    while (waiters.length > 0) {
      const resolve = waiters.shift()
      resolve()
    }
  }

  const enqueueDir = (dirPath) => {
    queue.push(dirPath)
    pendingDirs += 1
    wakeWorkers()
  }

  async function worker() {
    while (true) {
      while (queueIndex >= queue.length) {
        if (pendingDirs === 0) {
          return
        }

        await new Promise((resolve) => {
          waiters.push(resolve)
        })
      }

      const currentDir = queue[queueIndex]
      queueIndex += 1

      try {
        const dirents = await fs.readdir(currentDir, { withFileTypes: true })

        for (let i = 0; i < dirents.length; i += CONCURRENCY_LIMIT) {
          const batch = dirents.slice(i, i + CONCURRENCY_LIMIT)
          const results = await Promise.allSettled(
            batch.map((dirent) => processItem(currentDir, dirent, targets))
          )

          let failedTasks = 0
          for (const result of results) {
            if (result.status === "fulfilled" && result.value) {
              enqueueDir(result.value)
            } else if (result.status === "rejected") {
              failedTasks += 1
            }
          }

          if (failedTasks > 0) {
            console.warn(
              `${failedTasks} tasks failed in batch starting at index ${i} in directory: ${currentDir}`
            )
          }
        }
      } catch (error) {
        console.warn(`Cannot read directory ${currentDir}: ${error.message}`)
      } finally {
        pendingDirs -= 1
        if (pendingDirs === 0) {
          wakeWorkers()
        }
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY_LIMIT }, () => worker()))
}

;(async function startCleanup() {
  // 要删除的目录及文件名称
  const cleanupTargets = new Set([
    "node_modules",
    "dist",
    ".turbo",
    "dist.zip",
    ".next",
  ])
  const deleteLockFile = process.argv.includes("--del-lock")

  if (deleteLockFile) {
    cleanupTargets.add("pnpm-lock.yaml")
  }

  console.log(
    `🚀 Starting cleanup of targets: ${Array.from(cleanupTargets).join(", ")} from root: ${rootDir}`
  )

  const startTime = Date.now()

  try {
    console.log("📊 Scanning for cleanup targets...")

    await cleanTargets(rootDir, cleanupTargets)

    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000

    console.log(
      `✨ Cleanup process completed successfully in ${duration.toFixed(2)}s`
    )
  } catch (error) {
    console.error(`💥 Unexpected error during cleanup: ${error.message}`)
    process.exit(1)
  }
})()
