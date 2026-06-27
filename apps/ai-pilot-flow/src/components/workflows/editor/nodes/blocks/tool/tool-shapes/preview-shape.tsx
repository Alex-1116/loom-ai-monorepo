"use client"

import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

export function renderPreviewBody({ isRunning }: ToolRendererProps) {
  return (
    <div className="flex w-full">
      <div
        className={cn(
          "aspect-square w-full rounded-xl",
          "bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.03)_75%,rgba(255,255,255,0.03)),linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.03)_75%,rgba(255,255,255,0.03))] bg-[size:24px_24px] bg-[position:0_0,12px_12px]",
          isRunning &&
            "border-sky-400/20 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.1)]"
        )}
      />
    </div>
  )
}
