"use client"

import * as React from "react"

import {
  getPreviewDefinition,
  getPreviewPortOffset,
} from "@/components/workflows/editor/model/constants/preview-definitions"
import {
  WorkflowNodeBody,
  WorkflowNodeHeader,
  WorkflowNodePort,
  type WorkflowNodePortPointerHandler,
  WorkflowNodeShell,
} from "@/components/workflows/editor/nodes/shell/workflow-node-shell"
import { WORKFLOW_NODE_DEFAULTS } from "@/components/workflows/editor/model/constants/node-defaults"
import type { WorkflowNodePortData } from "@/components/workflows/editor/model/types/workflow-node"
import type { WorkflowExecutionStatus } from "@/components/workflows/shared/types/workflow-runtime"

type WorkflowPreviewNodeProps = {
  nodeId: string
  title?: string
  inputPorts?: WorkflowNodePortData[]
  inputLabel?: string
  isSelected?: boolean
  executionStatus?: WorkflowExecutionStatus
  onPortPointerDown?: WorkflowNodePortPointerHandler
}

export function WorkflowPreviewNode({
  nodeId,
  title = WORKFLOW_NODE_DEFAULTS.preview.title,
  inputPorts,
  inputLabel = WORKFLOW_NODE_DEFAULTS.preview.inputLabel,
  isSelected = false,
  executionStatus,
  onPortPointerDown,
}: WorkflowPreviewNodeProps) {
  const isRunning = executionStatus === "running"
  const previewDefinition = React.useMemo(() => getPreviewDefinition(), [])
  const defaultInputPorts = React.useMemo(
    () => previewDefinition.createData().inputPorts ?? [],
    [previewDefinition]
  )
  const resolvedInputPorts = inputPorts ?? defaultInputPorts
  const rendererProps = React.useMemo(
    () => ({
      nodeId,
      preview: previewDefinition,
      title,
      inputPorts: resolvedInputPorts,
      isSelected,
      executionStatus,
      isRunning,
    }),
    [
      executionStatus,
      isRunning,
      isSelected,
      nodeId,
      previewDefinition,
      resolvedInputPorts,
      title,
    ]
  )
  const customFooter = previewDefinition.renderer.renderFooter?.(rendererProps)
  const shouldCenterSingleInputPort = resolvedInputPorts.length === 1

  return (
    <WorkflowNodeShell
      widthClassName={previewDefinition.renderer.width}
      isSelected={isSelected}
      executionStatus={executionStatus}
      className="gap-4"
    >
      <WorkflowNodeHeader title={title ?? previewDefinition.label} />

      <WorkflowNodeBody className="w-full">
        {previewDefinition.renderer.renderBody(rendererProps)}
      </WorkflowNodeBody>

      {customFooter ?? null}

      {resolvedInputPorts.map((port, index) => (
        <WorkflowNodePort
          key={port.key}
          nodeId={nodeId}
          portKey={port.key}
          side="left"
          label={index === 0 ? inputLabel || port.label : port.label}
          labelVisibility={port.labelVisibility ?? "hover"}
          portToneClassName={port.portToneClassName}
          labelToneClassName={port.labelToneClassName}
          style={
            shouldCenterSingleInputPort
              ? undefined
              : { top: `${getPreviewPortOffset(index)}px` }
          }
          onPortPointerDown={onPortPointerDown}
        />
      ))}
    </WorkflowNodeShell>
  )
}
