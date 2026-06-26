"use client"

import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"

import type { ExportRendererProps } from "@/components/workflows/editor/model/constants/export-definitions"

export function renderExportBody({
  actionLabel,
  isRunning,
}: ExportRendererProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(
        "w-full rounded-md border border-white/6 bg-[#23242d] px-3 py-2 text-sm font-medium text-white/72 shadow-none hover:border-white/10 hover:bg-[#2a2c36] hover:text-white",
        isRunning &&
          "border-sky-400/20 bg-sky-400/10 text-sky-100 hover:border-sky-400/30 hover:bg-sky-400/12"
      )}
    >
      {isRunning ? "Exporting" : actionLabel}
    </Button>
  )
}
