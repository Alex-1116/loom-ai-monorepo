"use client"

import * as React from "react"
import { ChevronDown, Lock, Unlock } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

type AspectRatioPreset = "custom" | "1:1" | "4:3" | "16:9"

const ASPECT_RATIO_OPTIONS: Array<{
  value: AspectRatioPreset
  label: string
}> = [
  { value: "custom", label: "Custom" },
  { value: "1:1", label: "1:1" },
  { value: "4:3", label: "4:3" },
  { value: "16:9", label: "16:9" },
]

function stopPointer(event: React.PointerEvent<HTMLElement>) {
  event.stopPropagation()
}

function stopMouse(event: React.MouseEvent<HTMLElement>) {
  event.stopPropagation()
}

function getAspectRatioValue(preset: AspectRatioPreset) {
  if (preset === "1:1") {
    return 1
  }

  if (preset === "4:3") {
    return 4 / 3
  }

  if (preset === "16:9") {
    return 16 / 9
  }

  return null
}

function clampDimension(value: number) {
  if (Number.isNaN(value)) {
    return 1
  }

  return Math.min(Math.max(Math.round(value), 1), 4096)
}

function CropValueInput({
  value,
  prefix,
  onChange,
}: {
  value: number
  prefix: string
  onChange: (value: number) => void
}) {
  return (
    <div className="flex h-9 items-center rounded-md border border-white/10 bg-white/[0.03] px-3">
      <span className="mr-2 text-sm text-white/48">{prefix}</span>
      <input
        type="number"
        min={1}
        max={4096}
        value={value}
        className="w-full bg-transparent text-sm font-medium text-white/84 outline-none"
        onPointerDown={stopPointer}
        onClick={stopMouse}
        onChange={(event) => {
          onChange(clampDimension(Number(event.target.value)))
        }}
      />
    </div>
  )
}

export function renderCropBody({ isRunning }: ToolRendererProps) {
  const [aspectRatio, setAspectRatio] =
    React.useState<AspectRatioPreset>("custom")
  const [width, setWidth] = React.useState(1024)
  const [height, setHeight] = React.useState(1024)
  const [locked, setLocked] = React.useState(true)

  const applyWidth = React.useCallback(
    (nextWidth: number) => {
      const safeWidth = clampDimension(nextWidth)
      setWidth(safeWidth)

      const ratio = getAspectRatioValue(aspectRatio)
      if (locked && ratio) {
        setHeight(clampDimension(safeWidth / ratio))
      }
    },
    [aspectRatio, locked]
  )

  const applyHeight = React.useCallback(
    (nextHeight: number) => {
      const safeHeight = clampDimension(nextHeight)
      setHeight(safeHeight)

      const ratio = getAspectRatioValue(aspectRatio)
      if (locked && ratio) {
        setWidth(clampDimension(safeHeight * ratio))
      }
    },
    [aspectRatio, locked]
  )

  const resetControls = React.useCallback(() => {
    setAspectRatio("custom")
    setWidth(1024)
    setHeight(1024)
    setLocked(true)
  }, [])

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

      <div className="grid grid-cols-[96px_minmax(0,1fr)_auto] items-center gap-3">
        <div className="text-sm text-white/62">Aspect ratio</div>
        <label
          className="relative flex h-9 min-w-0 items-center rounded-md border border-white/10 bg-white/[0.03]"
          onPointerDown={stopPointer}
        >
          <select
            value={aspectRatio}
            className="h-full w-full appearance-none bg-transparent px-3 pr-9 text-sm font-medium text-white/84 outline-none"
            onPointerDown={stopPointer}
            onClick={stopMouse}
            onChange={(event) => {
              const nextAspectRatio = event.target.value as AspectRatioPreset
              setAspectRatio(nextAspectRatio)

              const ratio = getAspectRatioValue(nextAspectRatio)
              if (ratio && locked) {
                setHeight(clampDimension(width / ratio))
              }
            }}
          >
            {ASPECT_RATIO_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/58" />
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-sm text-sm font-medium text-white/78 shadow-none hover:bg-white/6 hover:text-white"
          onPointerDown={stopPointer}
          onClick={(event) => {
            event.stopPropagation()
            resetControls()
          }}
        >
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-3">
        <div className="text-sm text-white/62">Dimensions</div>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_36px] gap-2">
          <CropValueInput value={width} prefix="W" onChange={applyWidth} />
          <CropValueInput value={height} prefix="H" onChange={applyHeight} />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={locked ? "Unlock dimensions" : "Lock dimensions"}
            className="h-9 w-9 rounded-md border border-white/10 bg-white/[0.03] text-white/72 shadow-none hover:bg-white/[0.06] hover:text-white"
            onPointerDown={stopPointer}
            onClick={(event) => {
              event.stopPropagation()
              setLocked((current) => !current)
            }}
          >
            {locked ? (
              <Lock className="size-4" />
            ) : (
              <Unlock className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
