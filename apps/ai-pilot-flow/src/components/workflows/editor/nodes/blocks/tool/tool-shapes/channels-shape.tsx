"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

type ChannelOption = "red" | "green" | "blue" | "alpha"

const CHANNEL_OPTIONS: Array<{
  value: ChannelOption
  label: string
}> = [
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
  { value: "alpha", label: "Alpha" },
]

function stopPointer(event: React.PointerEvent<HTMLElement>) {
  event.stopPropagation()
}

function stopMouse(event: React.MouseEvent<HTMLElement>) {
  event.stopPropagation()
}

export function renderChannelsBody({ isRunning }: ToolRendererProps) {
  const [channel, setChannel] = React.useState<ChannelOption>("red")

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

      <div className="grid grid-cols-[114px_1fr_auto] items-center gap-3">
        <label
          className="relative flex h-9 min-w-0 items-center rounded-md border border-white/10 bg-white/[0.03]"
          onPointerDown={stopPointer}
        >
          <select
            value={channel}
            className="h-full w-full appearance-none bg-transparent px-3 pr-9 text-sm font-medium text-white/84 outline-none"
            onPointerDown={stopPointer}
            onClick={stopMouse}
            onChange={(event) => {
              setChannel(event.target.value as ChannelOption)
            }}
          >
            {CHANNEL_OPTIONS.map((option) => (
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
