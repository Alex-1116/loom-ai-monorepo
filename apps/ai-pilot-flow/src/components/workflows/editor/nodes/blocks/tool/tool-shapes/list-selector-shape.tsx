"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@loom/ui/components/select"

import { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

export function renderListSelectorBody(props: ToolRendererProps) {
  const [selectedValue, setSelectedValue] = React.useState<string>("")
  const [options] = React.useState<string[]>([
    "Option 1",
    "Option 2",
    "Option 3",
  ])

  return (
    <div className="flex flex-col gap-4">
      <Select value={selectedValue} onValueChange={setSelectedValue}>
        <SelectTrigger
          data-workflow-node-interactive
          className="w-full rounded-md border-white/8 bg-[#1f212b] text-sm text-white/92"
        >
          <SelectValue placeholder="No options available" />
        </SelectTrigger>
        <SelectContent
          data-workflow-overlay
          data-workflow-node-interactive
          className="rounded-md border border-white/10 bg-[#1d1e27]/98 p-1 text-white shadow-[0_18px_48px_rgba(0,0,0,0.42)] ring-0"
        >
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="rounded-md px-3 py-2 text-sm font-medium text-white/95 focus:bg-white/6 focus:text-white"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
