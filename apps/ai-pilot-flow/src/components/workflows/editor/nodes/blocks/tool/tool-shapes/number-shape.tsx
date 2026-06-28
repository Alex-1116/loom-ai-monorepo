"use client"

import * as React from "react"

import { Input } from "@loom/ui/components/input"
import { Checkbox } from "@loom/ui/components/checkbox"

import { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

export function renderNumberBody(props: ToolRendererProps) {
  const [value, setValue] = React.useState("0")
  const [useDecimals, setUseDecimals] = React.useState(false)
  const [min, setMin] = React.useState("")
  const [max, setMax] = React.useState("")

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={value}
        onChange={(e) => {
          const rawValue = e.target.value
          if (useDecimals) {
            if (/^-?\d*\.?\d*$/.test(rawValue)) {
              setValue(rawValue)
            }
          } else {
            if (/^-?\d*$/.test(rawValue)) {
              setValue(rawValue)
            }
          }
        }}
        className="rounded-md border-white/8 bg-[#1f212b] text-sm font-medium text-white/92"
        placeholder="0"
      />

      <label className="flex cursor-pointer items-center gap-2">
        <Checkbox
          checked={useDecimals}
          onCheckedChange={(checked) => setUseDecimals(checked as boolean)}
        />
        <span className="text-sm text-white/78">Use decimals (float)</span>
      </label>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1.5 block text-[10px] font-semibold tracking-[0.18em] text-white/45 uppercase">
            Min
          </label>
          <Input
            value={min}
            onChange={(e) => {
              const rawValue = e.target.value
              if (/^-?\d*\.?\d*$/.test(rawValue)) {
                setMin(rawValue)
              }
            }}
            className="rounded-md border-white/8 bg-[#1f212b] text-sm font-medium text-white/92"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-[10px] font-semibold tracking-[0.18em] text-white/45 uppercase">
            Max
          </label>
          <Input
            value={max}
            onChange={(e) => {
              const rawValue = e.target.value
              if (/^-?\d*\.?\d*$/.test(rawValue)) {
                setMax(rawValue)
              }
            }}
            className="rounded-md border-white/8 bg-[#1f212b] text-sm font-medium text-white/92"
          />
        </div>
      </div>
    </div>
  )
}
