"use client"

import * as React from "react"

import { Slider } from "@loom/ui/components/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@loom/ui/components/select"

const IMPORT_MULTIPLE_LORA_OPTIONS = [
  "LoRA Alpha",
  "LoRA Beta",
  "LoRA Gamma",
] as const

function ImportMultipleLorasBody() {
  const [weightValue, setWeightValue] = React.useState(0)
  const [selectedLora, setSelectedLora] = React.useState<string>(
    IMPORT_MULTIPLE_LORA_OPTIONS[0]
  )

  return (
    <div className="flex w-full flex-col gap-3">
      <Select value={selectedLora} onValueChange={setSelectedLora}>
        <SelectTrigger
          size="default"
          className="h-10 w-full rounded-md border-white/10 bg-[#23242d] px-4 text-sm text-white/75"
          onPointerDown={(event) => {
            event.stopPropagation()
          }}
        >
          <SelectValue placeholder="Select a LoRA" />
        </SelectTrigger>
        <SelectContent
          className="rounded-md border border-white/10 bg-[#1c1d26] text-white"
          onPointerDown={(event) => {
            event.stopPropagation()
          }}
        >
          {IMPORT_MULTIPLE_LORA_OPTIONS.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="text-white/82 data-[highlighted]:bg-white/70 data-[highlighted]:text-white data-[state=checked]:text-white"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div
        className="flex items-center gap-3"
        onPointerDown={(event) => {
          event.stopPropagation()
        }}
      >
        <span className="w-14 shrink-0 text-sm text-white/78">Weight</span>
        <Slider
          value={[weightValue]}
          onValueChange={(values) => {
            setWeightValue(values[0] ?? 0)
          }}
          min={0}
          max={1}
          step={0.01}
          className="flex-1 [&_[data-slot=slider-range]]:bg-white [&_[data-slot=slider-thumb]]:border-white/70 [&_[data-slot=slider-track]]:bg-white/12"
        />
        <div className="flex h-7 w-16 shrink-0 items-center justify-center rounded-sm border border-white/10 bg-[#23242d] px-3 text-sm text-white/82">
          {weightValue}
        </div>
      </div>
    </div>
  )
}

export function renderImportMultipleLorasBody() {
  return <ImportMultipleLorasBody />
}
