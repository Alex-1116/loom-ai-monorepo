"use client"

import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

export function renderDepthAnythingV2Body({ isRunning }: ToolRendererProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-xl",
          "bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.03)_75%,rgba(255,255,255,0.03)),linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.03)_75%,rgba(255,255,255,0.03))] bg-[size:24px_24px] bg-[position:0_0,12px_12px]",
          isRunning &&
            "border-sky-400/20 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.1)]"
        )}
      >
        <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-lg bg-black/40 px-2 py-1">
            <div className="h-2 w-2 rounded-full bg-[#6fe7d1]" />
            <span className="text-[10px] font-medium text-white/80">
              Depth Anything V2
            </span>
          </div>
          {isRunning && (
            <div className="flex items-center gap-2 rounded-lg bg-sky-500/20 px-2 py-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-sky-400" />
              <span className="text-[10px] font-medium text-sky-300">
                Processing...
              </span>
            </div>
          )}
        </div>

        {isRunning ? (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1),transparent_60%)]" />
        ) : null}
      </div>
    </div>
  )
}
