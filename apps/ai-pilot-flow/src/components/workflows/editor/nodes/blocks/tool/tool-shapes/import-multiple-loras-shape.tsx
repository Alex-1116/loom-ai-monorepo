"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

type LoraOption = "select-a-lora" | "cinematic" | "anime" | "portrait"

const LORA_OPTIONS: Array<{
  value: LoraOption
  label: string
}> = [
  { value: "select-a-lora", label: "Select a LoRA" },
  { value: "cinematic", label: "Cinematic" },
  { value: "anime", label: "Anime" },
  { value: "portrait", label: "Portrait" },
]

function stopPointer(event: React.PointerEvent<HTMLElement>) {
  event.stopPropagation()
}

function stopMouse(event: React.MouseEvent<HTMLElement>) {
  event.stopPropagation()
}

function clampWeight(value: number) {
  if (Number.isNaN(value)) {
    return 0
  }

  return Math.min(Math.max(Math.round(value), 0), 100)
}

function WeightValueField({ value }: { value: number }) {
  return (
    <div className="flex h-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm font-medium text-white/84">
      {value}
    </div>
  )
}

export function renderImportMultipleLorasBody({
  isRunning,
}: ToolRendererProps) {
  const [selectedLora, setSelectedLora] =
    React.useState<LoraOption>("select-a-lora")
  const [weight, setWeight] = React.useState(0)

  return (
    <div className="flex w-full flex-col gap-4">
      <label
        className={cn(
          "relative flex h-9 min-w-0 items-center rounded-md border border-white/10 bg-white/[0.03]",
          isRunning &&
            "border-sky-400/20 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.08)]"
        )}
        onPointerDown={stopPointer}
      >
        <select
          value={selectedLora}
          className="h-full w-full appearance-none bg-transparent px-4 pr-10 text-sm font-medium text-white/84 outline-none"
          onPointerDown={stopPointer}
          onClick={stopMouse}
          onChange={(event) => {
            setSelectedLora(event.target.value as LoraOption)
          }}
        >
          {LORA_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-white/58" />
      </label>

      <div className="grid grid-cols-[auto_minmax(0,1fr)_68px] items-center gap-3">
        <div className="text-sm text-white/62">Weight</div>
        <input
          type="range"
          min={0}
          max={100}
          value={weight}
          className="h-2 w-full cursor-pointer accent-white"
          onPointerDown={stopPointer}
          onChange={(event) => {
            setWeight(clampWeight(Number(event.target.value)))
          }}
        />
        <WeightValueField value={weight} />
      </div>
    </div>
  )
}
