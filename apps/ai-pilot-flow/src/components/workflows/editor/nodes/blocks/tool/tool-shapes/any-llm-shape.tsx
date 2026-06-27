"use client"

import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

export function renderAnyLlmBody({ isRunning }: ToolRendererProps) {
  return (
    <div className="flex w-full flex-col">
      <div
        className={cn(
          "min-h-[378px] w-full rounded-xl border border-white/6 bg-white/6 px-5 py-4 text-sm leading-6 text-white/24",
          isRunning &&
            "border-sky-400/20 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.1)]"
        )}
      >
        The generated text will appear here
      </div>
    </div>
  )
}
