"use client"

import {
  WorkflowNodeBody,
  WorkflowNodeHeader,
  WorkflowNodePort,
  type WorkflowNodePortPointerHandler,
  WorkflowNodeShell,
} from "@/components/workflows/editor/nodes/shell/workflow-node-shell"
import { WORKFLOW_NODE_DEFAULTS } from "@/components/workflows/editor/model/constants/node-defaults"
import { getRequiredWorkflowNodePort } from "@/components/workflows/editor/nodes/registry/workflow-node-registry"
import { Button } from "@loom/ui/components/button"

type WorkflowExportNodeProps = {
  nodeId: string
  title?: string
  inputLabel?: string
  actionLabel?: string
  isSelected?: boolean
  onPortPointerDown?: WorkflowNodePortPointerHandler
}

export function WorkflowExportNode({
  nodeId,
  title = WORKFLOW_NODE_DEFAULTS.export.title,
  inputLabel = WORKFLOW_NODE_DEFAULTS.export.inputLabel,
  actionLabel = WORKFLOW_NODE_DEFAULTS.export.actionLabel,
  isSelected = false,
  onPortPointerDown,
}: WorkflowExportNodeProps) {
  const port = getRequiredWorkflowNodePort("export", "input")

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
        nodeId={nodeId}
        portKey={port.key}
        side={port.side}
        label={inputLabel || port.label}
        labelVisibility={port.labelVisibility}
        portToneClassName={port.portToneClassName}
        labelToneClassName={port.labelToneClassName}
        onPortPointerDown={onPortPointerDown}
      />
    </WorkflowNodeShell>
  )
}
