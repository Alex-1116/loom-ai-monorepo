"use client"

import * as React from "react"

import {
  getExportDefinition,
  getExportPortOffset,
} from "@/components/workflows/editor/model/constants/export-definitions"
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

type WorkflowExportNodeProps = {
  nodeId: string
  title?: string
  inputPorts?: WorkflowNodePortData[]
  inputLabel?: string
  actionLabel?: string
  isSelected?: boolean
  executionStatus?: WorkflowExecutionStatus
  onPortPointerDown?: WorkflowNodePortPointerHandler
}

export function WorkflowExportNode({
  nodeId,
  title = WORKFLOW_NODE_DEFAULTS.export.title,
  inputPorts,
  inputLabel = WORKFLOW_NODE_DEFAULTS.export.inputLabel,
  actionLabel = WORKFLOW_NODE_DEFAULTS.export.actionLabel,
  isSelected = false,
  executionStatus,
  onPortPointerDown,
}: WorkflowExportNodeProps) {
  const isRunning = executionStatus === "running"
  const exportDefinition = React.useMemo(() => getExportDefinition(), [])
  const defaultInputPorts = React.useMemo(
    () => exportDefinition.createData().inputPorts ?? [],
    [exportDefinition]
  )
  const resolvedInputPorts = inputPorts ?? defaultInputPorts
  const rendererProps = React.useMemo(
    () => ({
      nodeId,
      exportNode: exportDefinition,
      title,
      inputPorts: resolvedInputPorts,
      actionLabel,
      isSelected,
      executionStatus,
      isRunning,
    }),
    [
      actionLabel,
      executionStatus,
      exportDefinition,
      isRunning,
      isSelected,
      nodeId,
      resolvedInputPorts,
      title,
    ]
  )
  const customFooter = exportDefinition.renderer.renderFooter?.(rendererProps)
  // Center single input port
  const shouldCenterSingleInputPort = resolvedInputPorts.length === 1

  return (
    <WorkflowNodeShell
      widthClassName={exportDefinition.renderer.width}
      isSelected={isSelected}
      executionStatus={executionStatus}
      className="gap-4"
    >
      <WorkflowNodeHeader title={title ?? exportDefinition.label} />

      <WorkflowNodeBody className="w-full">
        {exportDefinition.renderer.renderBody(rendererProps)}
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
              : { top: `${getExportPortOffset(index)}px` }
          }
          onPortPointerDown={onPortPointerDown}
        />
      ))}
    </WorkflowNodeShell>
  )
}
