"use client"

import * as React from "react"

import {
  getPromptDefinition,
  getPromptPortOffset,
} from "@/components/workflows/editor/model/constants/prompt-definitions"
import type { WorkflowNodePortData } from "@/components/workflows/editor/model/types/workflow-node"
import {
  WorkflowNodeBody,
  WorkflowNodeHeader,
  WorkflowNodePort,
  WorkflowNodeShell,
  type WorkflowNodePortPointerHandler,
} from "@/components/workflows/editor/nodes/shell/workflow-node-shell"
import type { WorkflowExecutionStatus } from "@/components/workflows/shared/types/workflow-runtime"

type WorkflowPromptNodeProps = {
  nodeId: string
  title?: string
  content?: string
  outputPorts?: WorkflowNodePortData[]
  addInputLabel?: string
  showAddInputAction?: boolean
  isSelected?: boolean
  executionStatus?: WorkflowExecutionStatus
  onPortPointerDown?: WorkflowNodePortPointerHandler
  onAddVariableClick?: () => void
  onContentChange?: (value: string) => void
  onContentCommit?: () => void
}

export function WorkflowPromptNode({
  nodeId,
  title,
  content,
  outputPorts,
  addInputLabel,
  showAddInputAction,
  isSelected = false,
  executionStatus,
  onPortPointerDown,
  onAddVariableClick,
  onContentChange,
  onContentCommit,
}: WorkflowPromptNodeProps) {
  const isRunning = executionStatus === "running"
  const promptDefinition = React.useMemo(() => getPromptDefinition(), [])
  const defaultOutputPorts = React.useMemo(
    () => promptDefinition.createData().outputPorts ?? [],
    [promptDefinition]
  )
  const resolvedOutputPorts = outputPorts ?? defaultOutputPorts
  const rendererProps = React.useMemo(
    () => ({
      nodeId,
      prompt: promptDefinition,
      title,
      content,
      outputPorts: resolvedOutputPorts ?? [],
      addInputLabel,
      showAddInputAction,
      isSelected,
      executionStatus,
      isRunning,
      onAddVariableClick,
      onContentChange,
      onContentCommit,
    }),
    [
      addInputLabel,
      content,
      executionStatus,
      isRunning,
      isSelected,
      nodeId,
      onAddVariableClick,
      onContentChange,
      onContentCommit,
      promptDefinition,
      resolvedOutputPorts,
      showAddInputAction,
      title,
    ]
  )
  const customFooter = promptDefinition.renderer.renderFooter?.(rendererProps)

  return (
    <WorkflowNodeShell
      widthClassName={promptDefinition.renderer.width}
      isSelected={isSelected}
      executionStatus={executionStatus}
      className="gap-4"
    >
      <WorkflowNodeHeader title={title ?? promptDefinition.label} />

      <WorkflowNodeBody className="w-full">
        {promptDefinition.renderer.renderBody(rendererProps)}
      </WorkflowNodeBody>

      {customFooter ?? null}

      {resolvedOutputPorts?.map((port, index) => (
        <WorkflowNodePort
          key={port.key}
          nodeId={nodeId}
          portKey={port.key}
          side="right"
          label={port.label}
          labelVisibility={port.labelVisibility ?? "hover"}
          portToneClassName={port.portToneClassName}
          labelToneClassName={port.labelToneClassName}
          style={{ top: `${getPromptPortOffset(index)}px` }}
          onPortPointerDown={onPortPointerDown}
        />
      ))}
    </WorkflowNodeShell>
  )
}
