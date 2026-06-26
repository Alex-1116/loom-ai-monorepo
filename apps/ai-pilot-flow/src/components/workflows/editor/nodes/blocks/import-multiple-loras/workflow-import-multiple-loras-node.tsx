"use client"

import * as React from "react"

import {
  getImportMultipleLorasDefinition,
  getImportMultipleLorasPortOffset,
} from "@/components/workflows/editor/model/constants/import-multiple-loras-definitions"
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

type WorkflowImportMultipleLorasNodeProps = {
  nodeId: string
  title?: string
  outputLabel?: string
  secondaryOutputLabel?: string
  outputPorts?: WorkflowNodePortData[]
  isSelected?: boolean
  executionStatus?: WorkflowExecutionStatus
  onPortPointerDown?: WorkflowNodePortPointerHandler
}

export function WorkflowImportMultipleLorasNode({
  nodeId,
  title = WORKFLOW_NODE_DEFAULTS["import-multiple-loras"].title,
  outputLabel = WORKFLOW_NODE_DEFAULTS["import-multiple-loras"].outputLabel,
  secondaryOutputLabel = WORKFLOW_NODE_DEFAULTS["import-multiple-loras"]
    .secondaryOutputLabel,
  outputPorts,
  isSelected = false,
  executionStatus,
  onPortPointerDown,
}: WorkflowImportMultipleLorasNodeProps) {
  const isRunning = executionStatus === "running"
  const importMultipleLorasDefinition = React.useMemo(
    () => getImportMultipleLorasDefinition(),
    []
  )
  const defaultOutputPorts = React.useMemo(
    () => importMultipleLorasDefinition.createData().outputPorts ?? [],
    [importMultipleLorasDefinition]
  )
  const resolvedOutputPorts = outputPorts ?? defaultOutputPorts
  const rendererProps = React.useMemo(
    () => ({
      nodeId,
      importMultipleLoras: importMultipleLorasDefinition,
      title,
      outputLabel,
      secondaryOutputLabel,
      outputPorts: resolvedOutputPorts,
      isSelected,
      executionStatus,
      isRunning,
    }),
    [
      executionStatus,
      importMultipleLorasDefinition,
      isRunning,
      isSelected,
      nodeId,
      outputLabel,
      resolvedOutputPorts,
      secondaryOutputLabel,
      title,
    ]
  )
  const customFooter =
    importMultipleLorasDefinition.renderer.renderFooter?.(rendererProps)
  const shouldCenterSingleOutputPort = resolvedOutputPorts.length === 1
  const shouldUseSplitTwoOutputLayout = resolvedOutputPorts.length === 2

  return (
    <WorkflowNodeShell
      widthClassName={importMultipleLorasDefinition.renderer.width}
      isSelected={isSelected}
      executionStatus={executionStatus}
      className="gap-4"
    >
      <WorkflowNodeHeader
        title={title ?? importMultipleLorasDefinition.label}
      />

      <WorkflowNodeBody className="w-full">
        {importMultipleLorasDefinition.renderer.renderBody(rendererProps)}
      </WorkflowNodeBody>

      {customFooter ?? null}

      {resolvedOutputPorts.map((port, index) => (
        <WorkflowNodePort
          key={port.key}
          nodeId={nodeId}
          portKey={port.key}
          side="right"
          label={
            index === 0
              ? outputLabel || port.label
              : index === 1
                ? secondaryOutputLabel || port.label
                : port.label
          }
          labelVisibility={port.labelVisibility ?? "hover"}
          portToneClassName={port.portToneClassName}
          labelToneClassName={port.labelToneClassName}
          className={
            shouldUseSplitTwoOutputLayout && index === 1
              ? "top-auto right-0 bottom-0 translate-x-1/2 translate-y-1/2"
              : undefined
          }
          style={
            shouldCenterSingleOutputPort
              ? undefined
              : shouldUseSplitTwoOutputLayout && index === 0
                ? undefined
                : shouldUseSplitTwoOutputLayout && index === 1
                  ? undefined
                  : { top: `${getImportMultipleLorasPortOffset(index)}px` }
          }
          onPortPointerDown={onPortPointerDown}
        />
      ))}
    </WorkflowNodeShell>
  )
}
