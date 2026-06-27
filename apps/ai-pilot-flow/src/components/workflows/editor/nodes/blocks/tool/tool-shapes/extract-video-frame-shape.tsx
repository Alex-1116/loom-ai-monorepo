"use client"

import * as React from "react"

import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

function stopPointer(event: React.PointerEvent<HTMLElement>) {
  event.stopPropagation()
}

function stopMouse(event: React.MouseEvent<HTMLElement>) {
  event.stopPropagation()
}

function clampFrame(value: number) {
  if (Number.isNaN(value)) {
    return 0
  }

  return Math.max(Math.round(value), 0)
}

function FrameField({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex h-9 items-center rounded-md border border-white/10 bg-white/[0.03] px-3">
      <input
        type="number"
        min={0}
        value={value}
        className="w-full bg-transparent text-sm font-medium text-white/84 outline-none"
        onPointerDown={stopPointer}
        onClick={stopMouse}
        onChange={(event) => {
          onChange(clampFrame(Number(event.target.value)))
        }}
      />
    </div>
  )
}

function TimecodeField({ value }: { value: string }) {
  return (
    <div className="flex h-9 items-center rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm font-medium text-white/34">
      {value}
    </div>
  )
}

export function renderExtractVideoFrameBody({ isRunning }: ToolRendererProps) {
  const [frame, setFrame] = React.useState(0)

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

      <div className="grid grid-cols-[auto_104px_auto_112px_1fr] items-center gap-3">
        <div className="text-sm text-white/82">Frame</div>
        <FrameField value={frame} onChange={setFrame} />
        <div className="text-sm text-white/62">Timecode</div>
        <TimecodeField value="00:00:00" />
      </div>
    </div>
  )
}
