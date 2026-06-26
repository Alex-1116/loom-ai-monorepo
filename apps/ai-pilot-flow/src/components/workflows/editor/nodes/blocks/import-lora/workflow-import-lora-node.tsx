"use client"

import * as React from "react"

import {
  getImportLoraDefinition,
  getImportLoraPortOffset,
} from "@/components/workflows/editor/model/constants/import-lora-definitions"
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

type WorkflowImportLoraNodeProps = {
  nodeId: string
  title?: string
  outputLabel?: string
  outputPorts?: WorkflowNodePortData[]
  isSelected?: boolean
  executionStatus?: WorkflowExecutionStatus
  onPortPointerDown?: WorkflowNodePortPointerHandler
}

export function WorkflowImportLoraNode({
  nodeId,
  title = WORKFLOW_NODE_DEFAULTS["import-lora"].title,
  outputLabel = WORKFLOW_NODE_DEFAULTS["import-lora"].outputLabel,
  outputPorts,
  isSelected = false,
  executionStatus,
  onPortPointerDown,
}: WorkflowImportLoraNodeProps) {
  const isRunning = executionStatus === "running"
  const importLoraDefinition = React.useMemo(
    () => getImportLoraDefinition(),
    []
  )
  const defaultOutputPorts = React.useMemo(
    () => importLoraDefinition.createData().outputPorts ?? [],
    [importLoraDefinition]
  )
  const resolvedOutputPorts = outputPorts ?? defaultOutputPorts
  const rendererProps = React.useMemo(
    () => ({
      nodeId,
      importLora: importLoraDefinition,
      title,
      outputLabel,
      outputPorts: resolvedOutputPorts,
      isSelected,
      executionStatus,
      isRunning,
    }),
    [
      executionStatus,
      importLoraDefinition,
      isRunning,
      isSelected,
      nodeId,
      outputLabel,
      resolvedOutputPorts,
      title,
    ]
  )
  const customFooter =
    importLoraDefinition.renderer.renderFooter?.(rendererProps)
  const shouldCenterSingleOutputPort = resolvedOutputPorts.length === 1

  return (
    <WorkflowNodeShell
      widthClassName={importLoraDefinition.renderer.width}
      isSelected={isSelected}
      executionStatus={executionStatus}
      className="gap-4"
    >
      <WorkflowNodeHeader title={title ?? importLoraDefinition.label} />

      <WorkflowNodeBody className="w-full">
        {importLoraDefinition.renderer.renderBody(rendererProps)}
      </WorkflowNodeBody>

      {customFooter ?? null}

      {resolvedOutputPorts.map((port, index) => (
        <WorkflowNodePort
          key={port.key}
          nodeId={nodeId}
          portKey={port.key}
          side="right"
          label={index === 0 ? outputLabel || port.label : port.label}
          labelVisibility={port.labelVisibility ?? "hover"}
          portToneClassName={port.portToneClassName}
          labelToneClassName={port.labelToneClassName}
          style={
            shouldCenterSingleOutputPort
              ? undefined
              : { top: `${getImportLoraPortOffset(index)}px` }
          }
          onPortPointerDown={onPortPointerDown}
        />
      ))}
    </WorkflowNodeShell>
  )
}
