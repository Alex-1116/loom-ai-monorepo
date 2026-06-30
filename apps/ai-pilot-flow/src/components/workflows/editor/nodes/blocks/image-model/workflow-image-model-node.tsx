"use client"

import * as React from "react"

import {
  getImageModelDefinition,
  getImageModelPortOffset,
} from "@/components/workflows/editor/model/constants/image-model-definitions"
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

type WorkflowImageModelNodeProps = {
  nodeId: string
  title?: string
  modelKey?: string
  inputPorts?: WorkflowNodePortData[]
  outputPorts?: WorkflowNodePortData[]
  addInputLabel?: string
  runLabel?: string
  showAddInputAction?: boolean
  showRunAction?: boolean
  isSelected?: boolean
  executionStatus?: WorkflowExecutionStatus
  runtimeError?: string
  onPortPointerDown?: WorkflowNodePortPointerHandler
  onAddInputClick?: () => void
  onRunClick?: () => void
}

const DEFAULT_INPUT_PORTS =
  WORKFLOW_NODE_DEFAULTS["image-model"].inputPorts ?? []
const DEFAULT_OUTPUT_PORTS =
  WORKFLOW_NODE_DEFAULTS["image-model"].outputPorts ?? []

export function WorkflowImageModelNode({
  nodeId,
  title = WORKFLOW_NODE_DEFAULTS["image-model"].title,
  modelKey = WORKFLOW_NODE_DEFAULTS["image-model"].modelKey,
  inputPorts = DEFAULT_INPUT_PORTS,
  outputPorts = DEFAULT_OUTPUT_PORTS,
  addInputLabel = WORKFLOW_NODE_DEFAULTS["image-model"].addInputLabel,
  runLabel = WORKFLOW_NODE_DEFAULTS["image-model"].runLabel,
  showAddInputAction = WORKFLOW_NODE_DEFAULTS["image-model"].showAddInputAction,
  showRunAction = WORKFLOW_NODE_DEFAULTS["image-model"].showRunAction,
  isSelected = false,
  executionStatus,
  runtimeError,
  onPortPointerDown,
  onAddInputClick,
  onRunClick,
}: WorkflowImageModelNodeProps) {
  const isRunning = executionStatus === "running"
  const imageModelDefinition = React.useMemo(
    () => getImageModelDefinition(modelKey),
    [modelKey]
  )
  const rendererProps = React.useMemo(
    () => ({
      nodeId,
      imageModel:
        imageModelDefinition ??
        ({
          key: modelKey ?? "image-model",
          group: "image-models",
          label: title ?? "Image Model",
          mode: "generate-from-text",
          menu: {
            category: "Image models",
          },
          createData: () => WORKFLOW_NODE_DEFAULTS["image-model"],
          renderer: {
            renderBody: () => null,
          },
        } as const),
      title,
      inputPorts,
      outputPorts,
      addInputLabel,
      runLabel,
      showAddInputAction,
      showRunAction,
      isSelected,
      executionStatus,
      isRunning,
      onAddInputClick,
      onRunClick,
    }),
    [
      addInputLabel,
      executionStatus,
      imageModelDefinition,
      inputPorts,
      isRunning,
      isSelected,
      modelKey,
      nodeId,
      onAddInputClick,
      onRunClick,
      outputPorts,
      runLabel,
      showAddInputAction,
      showRunAction,
      title,
    ]
  )
  const customFooter =
    imageModelDefinition?.renderer.renderFooter?.(rendererProps)

  return (
    <WorkflowNodeShell
      widthClassName={imageModelDefinition?.renderer.width}
      isSelected={isSelected}
      executionStatus={executionStatus}
      className="gap-4"
    >
      <WorkflowNodeHeader title={title ?? imageModelDefinition?.label} />

      <WorkflowNodeBody
        className="w-full"
        errorState={
          runtimeError && executionStatus === "failed"
            ? {
                title: "Model run failed",
                description: runtimeError,
              }
            : null
        }
      >
        {imageModelDefinition?.renderer.renderBody(rendererProps) ?? null}
      </WorkflowNodeBody>

      {customFooter ?? null}

      {inputPorts.map((port, index) => (
        <WorkflowNodePort
          key={port.key}
          nodeId={nodeId}
          portKey={port.key}
          side="left"
          label={port.label}
          labelVisibility={port.labelVisibility ?? "hover"}
          portToneClassName={port.portToneClassName}
          labelToneClassName={port.labelToneClassName}
          style={{ top: `${getImageModelPortOffset(modelKey, index)}px` }}
          onPortPointerDown={onPortPointerDown}
        />
      ))}

      {outputPorts.map((port, index) => (
        <WorkflowNodePort
          key={port.key}
          nodeId={nodeId}
          portKey={port.key}
          side="right"
          label={port.label}
          labelVisibility={port.labelVisibility ?? "hover"}
          portToneClassName={port.portToneClassName}
          labelToneClassName={port.labelToneClassName}
          style={{ top: `${getImageModelPortOffset(modelKey, index)}px` }}
          onPortPointerDown={onPortPointerDown}
        />
      ))}
    </WorkflowNodeShell>
  )
}
