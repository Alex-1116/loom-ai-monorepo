"use client"

import * as React from "react"

import { Textarea } from "@loom/ui/components/textarea"

import { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

export function renderTextBody(props: ToolRendererProps) {
  const [value, setValue] = React.useState("")

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="min-h-[258px] rounded-md border-white/8 bg-[#1f212b] text-sm text-white/92"
        placeholder="Text here..."
        rows={6}
      />
    </div>
  )
}
