"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

type CompareMode = "slider" | "swipe" | "fade"

const COMPARE_MODE_OPTIONS: Array<{
  value: CompareMode
  label: string
}> = [
  { value: "slider", label: "Slider" },
  { value: "swipe", label: "Swipe" },
  { value: "fade", label: "Fade" },
]

function stopPointer(event: React.PointerEvent<HTMLElement>) {
  event.stopPropagation()
}

function stopMouse(event: React.MouseEvent<HTMLElement>) {
  event.stopPropagation()
}

export function renderCompareBody({ isRunning }: ToolRendererProps) {
  const [mode, setMode] = React.useState<CompareMode>("slider")

  return (
    <div className="flex w-full flex-col gap-4">
      <div
        className={cn(
          "relative aspect-square w-full overflow-hidden rounded-xl bg-[#1f212b]",
          isRunning && "shadow-[inset_0_0_0_1px_rgba(56,189,248,0.14)]"
        )}
        style={{
          backgroundImage:
            "linear-gradient(45deg, rgba(255,255,255,0.06) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.06) 75%, rgba(255,255,255,0.06)), linear-gradient(45deg, rgba(255,255,255,0.06) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.06) 75%, rgba(255,255,255,0.06))",
          backgroundPosition: "0 0, 12px 12px",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-lg bg-black/40 px-2 py-1">
            <div className="h-2 w-2 rounded-full bg-white/60" />
            <span className="text-[10px] font-medium text-white/80">
              Input 1 vs Input 2
            </span>
          </div>
          {isRunning && (
            <div className="flex items-center gap-2 rounded-lg bg-sky-500/20 px-2 py-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-sky-400" />
              <span className="text-[10px] font-medium text-sky-300">
                Comparing...
              </span>
            </div>
          )}
        </div>

        {isRunning ? (
          <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1),transparent_60%)]" />
        ) : null}
      </div>

      <div className="grid grid-cols-[auto_100px_minmax(0,1fr)] items-center gap-3">
        <div className="text-sm text-white/62">Mode</div>
        <label
          className="relative flex h-9 min-w-0 items-center rounded-md border border-white/10 bg-white/[0.03]"
          onPointerDown={stopPointer}
        >
          <select
            value={mode}
            className="h-full w-full appearance-none bg-transparent px-3 pr-9 text-sm font-medium text-white/84 outline-none"
            onPointerDown={stopPointer}
            onClick={stopMouse}
            onChange={(event) => {
              setMode(event.target.value as CompareMode)
            }}
          >
            {COMPARE_MODE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/58" />
        </label>
      </div>
    </div>
  )
}
