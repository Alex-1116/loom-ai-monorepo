"use client"

import * as React from "react"

import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

function createCheckerboardBackground() {
  return {
    backgroundImage:
      "linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05)), linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05))",
    backgroundPosition: "0 0, 12px 12px",
    backgroundSize: "24px 24px",
  }
}

function stopPointer(event: React.PointerEvent<HTMLElement>) {
  event.stopPropagation()
}

export function renderRunwayAleph2KeyframeBody({
  isRunning,
}: ToolRendererProps) {
  const [time, setTime] = React.useState("00:00")

  return (
    <div className="flex w-full flex-col gap-4">
      <div
        className={cn(
          "relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/6 bg-[#1f212b]",
          isRunning && "shadow-[inset_0_0_0_1px_rgba(56,189,248,0.14)]"
        )}
        style={createCheckerboardBackground()}
      >
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-black/40 px-2 py-1">
          <div className="h-2 w-2 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#ef4444]" />
          <span className="text-[10px] font-medium text-white/80">
            Runway Aleph 2
          </span>
        </div>

        {isRunning && (
          <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1),transparent_60%)]" />
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-white/50">Time</div>
        <div className="relative">
          <input
            type="text"
            value={time}
            className="h-7 w-[72px] rounded border border-white/10 bg-white/[0.03] text-center font-mono text-sm font-medium text-white/80 outline-none"
            onPointerDown={stopPointer}
            onChange={(event) => setTime(event.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
