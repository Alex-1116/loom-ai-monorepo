"use client"

import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

export function renderExportBody({ isRunning }: ToolRendererProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(
        "w-full cursor-pointer rounded-md border border-white/6 text-sm font-medium text-white/72 shadow-none hover:bg-white/6 hover:text-white",
        isRunning &&
          "border-sky-400/20 bg-sky-400/10 text-sky-100 hover:border-sky-400/30 hover:bg-sky-400/12"
      )}
    >
      {isRunning ? "Exporting" : "Export"}
    </Button>
  )
}
