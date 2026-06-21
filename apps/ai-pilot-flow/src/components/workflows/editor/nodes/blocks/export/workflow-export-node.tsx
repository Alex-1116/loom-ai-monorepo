"use client"

import {
  WorkflowNodeBody,
  WorkflowNodeHeader,
  WorkflowNodePort,
  WorkflowNodeShell,
} from "@/components/workflows/editor/nodes/shell/workflow-node-shell"
import { Button } from "@loom/ui/components/button"

type WorkflowExportNodeProps = {
  title?: string
  inputLabel?: string
  actionLabel?: string
  isSelected?: boolean
}

export function WorkflowExportNode({
  title = "Export",
  inputLabel = "Input",
  actionLabel = "Export",
  isSelected = false,
}: WorkflowExportNodeProps) {
  return (
    <WorkflowNodeShell isSelected={isSelected}>
      <WorkflowNodeHeader title={title} />

      <WorkflowNodeBody>
        {/* export 节点当前只保留一个主动作按钮，输入口由左侧 port 表达。 */}
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-md px-2 py-1 text-sm font-medium text-white/70 shadow-none hover:bg-white/6 hover:text-white"
        >
          {actionLabel}
        </Button>
      </WorkflowNodeBody>

      <WorkflowNodePort
        side="left"
        label={inputLabel}
        labelVisibility="hover"
      />
    </WorkflowNodeShell>
  )
}
