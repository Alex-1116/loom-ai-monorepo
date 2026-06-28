"use client"

import * as React from "react"

import { Switch } from "@loom/ui/components/switch"

import { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

export function renderToggleBody(props: ToolRendererProps) {
  const [checked, setChecked] = React.useState(false)

  return (
    <div className="flex items-center justify-start gap-3">
      <span className="text-sm text-white/78">
        {checked ? "True" : "False"}
      </span>
      <Switch
        checked={checked}
        onCheckedChange={(newChecked) => setChecked(newChecked as boolean)}
      />
    </div>
  )
}
