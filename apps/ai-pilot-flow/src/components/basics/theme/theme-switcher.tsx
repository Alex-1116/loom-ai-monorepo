"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import clsx from "clsx"
import { Monitor, Moon, Sun } from "lucide-react"

export default function ThemeSwitcher() {
  const t = useTranslations("theme")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 等待客户端挂载后再渲染
  useEffect(() => {
    setMounted(true)
  }, [])

  // 在客户端挂载前返回占位符
  if (!mounted) {
    return (
      <div className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 p-1 dark:border-gray-800">
        <div className="size-5" />
        <div className="size-5" />
        <div className="size-5" />
      </div>
    )
  }

  return (
    <div className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 p-1 dark:border-gray-800">
      <button
        className={clsx(
          "cursor-pointer rounded-md p-1",
          "hover:bg-gray-50 dark:hover:bg-gray-700",
          "transition-colors",
          theme === "system" && "bg-gray-100 dark:bg-gray-800"
        )}
        onClick={() => setTheme("system")}
        aria-label={t("system")}
      >
        <Monitor className="size-3" />
      </button>
      <button
        className={clsx(
          "cursor-pointer rounded-md p-1",
          "hover:bg-gray-50 dark:hover:bg-gray-700",
          "transition-colors",
          theme === "light" && "bg-gray-100 dark:bg-gray-800"
        )}
        onClick={() => setTheme("light")}
        aria-label={t("light")}
      >
        <Sun className="size-3" />
      </button>
      <button
        className={clsx(
          "cursor-pointer rounded-md p-1",
          "hover:bg-gray-50 dark:hover:bg-gray-700",
          "transition-colors",
          theme === "dark" && "bg-gray-100 dark:bg-gray-800"
        )}
        onClick={() => setTheme("dark")}
        aria-label={t("dark")}
      >
        <Moon className="size-3" />
      </button>
    </div>
  )
}
