"use client"

import * as React from "react"

import {
  getFileDefinition,
  getFilePortOffset,
} from "@/components/workflows/editor/model/constants/file-definitions"
import { WORKFLOW_NODE_DEFAULTS } from "@/components/workflows/editor/model/constants/node-defaults"
import type { WorkflowNodePortData } from "@/components/workflows/editor/model/types/workflow-node"
import {
  WorkflowNodeBody,
  WorkflowNodeHeader,
  WorkflowNodePort,
  type WorkflowNodePortPointerHandler,
  WorkflowNodeShell,
} from "@/components/workflows/editor/nodes/shell/workflow-node-shell"
import type { WorkflowExecutionStatus } from "@/components/workflows/shared/types/workflow-runtime"

type WorkflowFileNodeProps = {
  nodeId: string
  title?: string
  outputPorts?: WorkflowNodePortData[]
  isSelected?: boolean
  executionStatus?: WorkflowExecutionStatus
  onPortPointerDown?: WorkflowNodePortPointerHandler
}

export function WorkflowFileNode({
  nodeId,
  title = WORKFLOW_NODE_DEFAULTS.file.title,
  outputPorts,
  isSelected = false,
  executionStatus,
  onPortPointerDown,
}: WorkflowFileNodeProps) {
  const isRunning = executionStatus === "running"
  const fileDefinition = React.useMemo(() => getFileDefinition(), [])
  const defaultOutputPorts = React.useMemo(
    () => fileDefinition.createData().outputPorts ?? [],
    [fileDefinition]
  )
  const resolvedOutputPorts = outputPorts ?? defaultOutputPorts
  const rendererProps = React.useMemo(
    () => ({
      nodeId,
      file: fileDefinition,
      title,
      outputPorts: resolvedOutputPorts,
      isSelected,
      executionStatus,
      isRunning,
    }),
    [
      executionStatus,
      fileDefinition,
      isRunning,
      isSelected,
      nodeId,
      resolvedOutputPorts,
      title,
    ]
  )
  const customFooter = fileDefinition.renderer.renderFooter?.(rendererProps)

  return (
    <WorkflowNodeShell
      widthClassName={fileDefinition.renderer.width}
      isSelected={isSelected}
      executionStatus={executionStatus}
      className="gap-4"
    >
      <WorkflowNodeHeader title={title ?? fileDefinition.label} />

      <WorkflowNodeBody className="w-full">
        {fileDefinition.renderer.renderBody(rendererProps)}
      </WorkflowNodeBody>

      {customFooter ?? null}

      {resolvedOutputPorts.map((port, index) => (
        <WorkflowNodePort
          key={port.key}
          nodeId={nodeId}
          portKey={port.key}
          side="right"
          label={port.label}
          labelVisibility={port.labelVisibility ?? "hover"}
          portToneClassName={port.portToneClassName}
          labelToneClassName={port.labelToneClassName}
          style={{ top: `${getFilePortOffset(index)}px` }}
          onPortPointerDown={onPortPointerDown}
        />
      ))}
    </WorkflowNodeShell>
  )
}
