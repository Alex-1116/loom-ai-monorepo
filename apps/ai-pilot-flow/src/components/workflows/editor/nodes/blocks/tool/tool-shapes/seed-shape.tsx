"use client"

import * as React from "react"

import { Input } from "@loom/ui/components/input"
import { Checkbox } from "@loom/ui/components/checkbox"

import { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

export function renderSeedBody(props: ToolRendererProps) {
  const [value, setValue] = React.useState("1")
  const [random, setRandom] = React.useState(false)

  return (
    <div className="flex items-center gap-3">
      <label className="flex cursor-pointer items-center gap-2">
        <Checkbox
          checked={random}
          onCheckedChange={(checked) => setRandom(checked as boolean)}
        />
        <span className="text-sm text-white/78">Random</span>
      </label>
      <Input
        value={value}
        onChange={(e) => {
          const rawValue = e.target.value
          if (/^\d*$/.test(rawValue)) {
            setValue(rawValue)
          }
        }}
        className="flex-1 rounded-md border-white/8 bg-[#1f212b] text-sm font-medium text-white/92"
        disabled={random}
      />
    </div>
  )
}
