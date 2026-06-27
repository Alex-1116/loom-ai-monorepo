"use client"

import { Upload } from "lucide-react"

import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

export function renderImportLoraBody({ isRunning }: ToolRendererProps) {
  return (
    <div className="flex w-full">
      <div
        className={cn(
          "flex min-h-[120px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/35",
          "bg-transparent text-center",
          isRunning &&
            "border-sky-400/35 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.08)]"
        )}
      >
        <Upload className="size-4 text-white/80" />
        <p className="text-sm text-white/78">Click to Upload</p>
      </div>
    </div>
  )
}
