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
import type { WorkflowExecutionStatus } from "@/components/workflows/shared/types/workflow-runtime"

type WorkflowPreviewNodeProps = {
  nodeId: string
  title?: string
  inputLabel?: string
  isSelected?: boolean
  executionStatus?: WorkflowExecutionStatus
  onPortPointerDown?: WorkflowNodePortPointerHandler
}

export function WorkflowPreviewNode({
  nodeId,
  title = WORKFLOW_NODE_DEFAULTS.preview.title,
  inputLabel = WORKFLOW_NODE_DEFAULTS.preview.inputLabel,
  isSelected = false,
  executionStatus,
  onPortPointerDown,
}: WorkflowPreviewNodeProps) {
  const port = getRequiredWorkflowNodePort("preview", "input")

  return (
    <WorkflowNodeShell
      isSelected={isSelected}
      executionStatus={executionStatus}
    >
      <WorkflowNodeHeader title={title} />

      <WorkflowNodeBody>
        <div
          className="aspect-square w-full rounded-[14px] bg-[#1f212b]"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.04) 75%, rgba(255,255,255,0.04)), linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.04) 75%, rgba(255,255,255,0.04))",
            backgroundPosition: "0 0, 12px 12px",
            backgroundSize: "24px 24px",
          }}
        />
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
