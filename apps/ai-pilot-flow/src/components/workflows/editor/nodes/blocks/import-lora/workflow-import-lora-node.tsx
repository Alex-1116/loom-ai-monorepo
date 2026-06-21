"use client"

import { Upload } from "lucide-react"

import { WORKFLOW_NODE_DEFAULTS } from "@/components/workflows/editor/model/constants/node-defaults"
import { getRequiredWorkflowNodePort } from "@/components/workflows/editor/nodes/registry/workflow-node-registry"
import {
  WorkflowNodeBody,
  WorkflowNodeHeader,
  WorkflowNodePort,
  type WorkflowNodePortPointerHandler,
  WorkflowNodeShell,
} from "@/components/workflows/editor/nodes/shell/workflow-node-shell"
import type { WorkflowExecutionStatus } from "@/components/workflows/shared/types/workflow-runtime"

type WorkflowImportLoraNodeProps = {
  nodeId: string
  title?: string
  outputLabel?: string
  isSelected?: boolean
  executionStatus?: WorkflowExecutionStatus
  onPortPointerDown?: WorkflowNodePortPointerHandler
}

export function WorkflowImportLoraNode({
  nodeId,
  title = WORKFLOW_NODE_DEFAULTS["import-lora"].title,
  outputLabel = WORKFLOW_NODE_DEFAULTS["import-lora"].outputLabel,
  isSelected = false,
  executionStatus,
  onPortPointerDown,
}: WorkflowImportLoraNodeProps) {
  const port = getRequiredWorkflowNodePort("import-lora", "output")

  return (
    <WorkflowNodeShell
      isSelected={isSelected}
      executionStatus={executionStatus}
    >
      <WorkflowNodeHeader title={title} />

      <WorkflowNodeBody>
        <div className="flex h-[240px] w-full items-center justify-center rounded-[14px] border border-dashed border-white/10 bg-[#20222d]">
          <div className="flex flex-col items-center gap-3 p-4 text-center">
            <div className="flex size-9 items-center justify-center rounded-full border border-white/12 bg-white/4">
              <Upload className="size-4 text-white/80" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-white/72">Clock to Upload</p>
            </div>
          </div>
        </div>
      </WorkflowNodeBody>

      <WorkflowNodePort
        nodeId={nodeId}
        portKey={port.key}
        side={port.side}
        label={outputLabel || port.label}
        labelVisibility={port.labelVisibility}
        portToneClassName={port.portToneClassName}
        labelToneClassName={port.labelToneClassName}
        onPortPointerDown={onPortPointerDown}
      />
    </WorkflowNodeShell>
  )
}
