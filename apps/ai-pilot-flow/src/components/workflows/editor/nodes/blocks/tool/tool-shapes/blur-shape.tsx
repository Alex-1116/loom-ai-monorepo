"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

type BlurType = "box" | "gaussian" | "lens"

const BLUR_TYPE_OPTIONS: Array<{
  value: BlurType
  label: string
}> = [
  { value: "box", label: "Box" },
  { value: "gaussian", label: "Gaussian" },
  { value: "lens", label: "Lens" },
]

function stopPointer(event: React.PointerEvent<HTMLElement>) {
  event.stopPropagation()
}

function stopMouse(event: React.MouseEvent<HTMLElement>) {
  event.stopPropagation()
}

function clampBlurSize(value: number) {
  if (Number.isNaN(value)) {
    return 1
  }

  return Math.min(Math.max(Math.round(value), 1), 100)
}

function BlurValueField({ value }: { value: number }) {
  return (
    <div className="flex h-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm font-medium text-white/84">
      {value}
    </div>
  )
}

export function renderBlurBody({ isRunning }: ToolRendererProps) {
  const [blurType, setBlurType] = React.useState<BlurType>("box")
  const [size, setSize] = React.useState(3)

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="relative w-full overflow-hidden rounded-xl">
        <div
          className={cn(
            "aspect-square w-full rounded-xl bg-[linear-gradient(45deg,rgba(255,255,255,0.06)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.06)_75%,rgba(255,255,255,0.06)),linear-gradient(45deg,rgba(255,255,255,0.06)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.06)_75%,rgba(255,255,255,0.06))] bg-[size:24px_24px] bg-[position:0_0,12px_12px]",
            "bg-[#2a2c33]",
            isRunning && "shadow-[inset_0_0_0_1px_rgba(56,189,248,0.16)]"
          )}
        />
      </div>

      <div className="grid grid-cols-[auto_114px_auto_minmax(0,1fr)_56px] items-center gap-3">
        <div className="text-sm text-white/62">Type</div>
        <label
          className="relative flex h-9 min-w-0 items-center rounded-md border border-white/10 bg-white/[0.03]"
          onPointerDown={stopPointer}
        >
          <select
            value={blurType}
            className="h-full w-full appearance-none bg-transparent px-3 pr-9 text-sm font-medium text-white/84 outline-none"
            onPointerDown={stopPointer}
            onClick={stopMouse}
            onChange={(event) => {
              setBlurType(event.target.value as BlurType)
            }}
          >
            {BLUR_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/58" />
        </label>

        <div className="text-sm text-white/62">Size</div>
        <input
          type="range"
          min={1}
          max={100}
          value={size}
          className="h-2 w-full cursor-pointer accent-white"
          onPointerDown={stopPointer}
          onChange={(event) => {
            setSize(clampBlurSize(Number(event.target.value)))
          }}
        />
        <BlurValueField value={size} />
      </div>
    </div>
  )
}
