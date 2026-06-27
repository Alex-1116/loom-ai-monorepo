"use client"

import * as React from "react"
import { Link, Unlink } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

function stopPointer(event: React.PointerEvent<HTMLElement>) {
  event.stopPropagation()
}

function stopMouse(event: React.MouseEvent<HTMLElement>) {
  event.stopPropagation()
}

function clampDimension(value: number) {
  if (Number.isNaN(value)) {
    return 1
  }

  return Math.min(Math.max(Math.round(value), 1), 4096)
}

function ResizeValueInput({
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

export function renderResizeBody({ isRunning }: ToolRendererProps) {
  const [width, setWidth] = React.useState(1024)
  const [height, setHeight] = React.useState(1024)
  const [locked, setLocked] = React.useState(true)

  const ratioRef = React.useRef(width / height)

  React.useEffect(() => {
    ratioRef.current = width / height
  }, [width, height])

  const applyWidth = React.useCallback(
    (nextWidth: number) => {
      const safeWidth = clampDimension(nextWidth)
      setWidth(safeWidth)

      if (locked) {
        setHeight(clampDimension(safeWidth / ratioRef.current))
      }
    },
    [locked]
  )

  const applyHeight = React.useCallback(
    (nextHeight: number) => {
      const safeHeight = clampDimension(nextHeight)
      setHeight(safeHeight)

      if (locked) {
        setWidth(clampDimension(safeHeight * ratioRef.current))
      }
    },
    [locked]
  )

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

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_36px] gap-2">
        <ResizeValueInput value={width} prefix="W" onChange={applyWidth} />
        <ResizeValueInput value={height} prefix="H" onChange={applyHeight} />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={locked ? "Unlock resize ratio" : "Lock resize ratio"}
          className="size-9 rounded-md border border-white/10 bg-white/[0.03] text-white/72 shadow-none hover:bg-white/[0.06] hover:text-white"
          onPointerDown={stopPointer}
          onClick={(event) => {
            event.stopPropagation()
            setLocked((current) => !current)
          }}
        >
          {locked ? <Link className="size-4" /> : <Unlink className="size-4" />}
        </Button>
      </div>
    </div>
  )
}
