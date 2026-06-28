"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"

const BLEND_MODE_OPTIONS: Array<{
  value: BlendMode
  label: string
}> = [
  { value: "normal", label: "Normal" },
  { value: "multiply", label: "Multiply" },
  { value: "screen", label: "Screen" },
  { value: "overlay", label: "Overlay" },
  { value: "darken", label: "Darken" },
  { value: "lighten", label: "Lighten" },
  { value: "color-dodge", label: "Color Dodge" },
  { value: "color-burn", label: "Color Burn" },
  { value: "hard-light", label: "Hard Light" },
  { value: "soft-light", label: "Soft Light" },
  { value: "difference", label: "Difference" },
  { value: "exclusion", label: "Exclusion" },
]

function stopPointer(event: React.PointerEvent<HTMLElement>) {
  event.stopPropagation()
}

function stopMouse(event: React.MouseEvent<HTMLElement>) {
  event.stopPropagation()
}

function createCheckerboardBackground() {
  return {
    backgroundImage:
      "linear-gradient(45deg, rgba(255,255,255,0.06) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.06) 75%, rgba(255,255,255,0.06)), linear-gradient(45deg, rgba(255,255,255,0.06) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.06) 75%, rgba(255,255,255,0.06))",
    backgroundPosition: "0 0, 12px 12px",
    backgroundSize: "24px 24px",
  }
}

export function renderBlendBody({ isRunning }: ToolRendererProps) {
  const [mode, setMode] = React.useState<BlendMode>("normal")
  const [opacity, setOpacity] = React.useState(100)

  return (
    <div className="flex w-full flex-col gap-4">
      <div
        className={cn(
          "relative aspect-square w-full overflow-hidden rounded-xl bg-[#1f212b]",
          isRunning && "shadow-[inset_0_0_0_1px_rgba(56,189,248,0.14)]"
        )}
        style={createCheckerboardBackground()}
      >
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-black/40 px-2 py-1">
          <div className="h-2 w-2 rounded-full border border-white/40" />
          <span className="text-[10px] font-medium text-white/80">
            Back + Front
          </span>
        </div>

        {isRunning && (
          <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1),transparent_60%)]" />
        )}
      </div>

      <div className="grid grid-cols-[auto_auto_auto_minmax(0,1fr)_50px] items-center gap-3">
        <div className="text-sm text-white/50">Mode</div>
        <label
          className="relative flex h-7 min-w-0 items-center rounded border border-white/10 bg-white/[0.03]"
          onPointerDown={stopPointer}
        >
          <select
            value={mode}
            className="h-full w-full appearance-none bg-transparent px-3 pr-9 text-sm font-medium text-white/84 outline-none"
            onPointerDown={stopPointer}
            onClick={stopMouse}
            onChange={(event) => {
              setMode(event.target.value as BlendMode)
            }}
          >
            {BLEND_MODE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/58" />
        </label>
        <div className="text-sm text-white/50">Opacity</div>
        <input
          type="range"
          min={0}
          max={100}
          value={opacity}
          className="h-2 w-full cursor-pointer accent-white"
          onPointerDown={stopPointer}
          onChange={(event) => {
            setOpacity(Number(event.target.value))
          }}
        />
        <input
          type="text"
          value={opacity}
          className="h-7 rounded border border-white/10 bg-white/[0.03] text-center font-mono text-sm font-medium text-white/80 outline-none"
          onPointerDown={stopPointer}
          onChange={(event) => {
            const value = Math.min(100, Math.max(0, Number(event.target.value)))
            setOpacity(isNaN(value) ? 100 : value)
          }}
        />
      </div>
    </div>
  )
}
