"use client"

import * as React from "react"

import {
  getVideoModelDefinition,
  getVideoModelPortOffset,
} from "@/components/workflows/editor/model/constants/video-model-definitions"
import { WORKFLOW_NODE_DEFAULTS } from "@/components/workflows/editor/model/constants/node-defaults"
import type { WorkflowNodePortData } from "@/components/workflows/editor/model/types/workflow-node"
import {
  WorkflowNodeBody,
  WorkflowNodeFooter,
  WorkflowNodeHeader,
  WorkflowNodePort,
  type WorkflowNodePortPointerHandler,
  WorkflowNodeShell,
} from "@/components/workflows/editor/nodes/shell/workflow-node-shell"
import type { WorkflowExecutionStatus } from "@/components/workflows/shared/types/workflow-runtime"
import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"
import { ArrowRight, Plus } from "lucide-react"

type WorkflowVideoModelNodeProps = {
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
  WORKFLOW_NODE_DEFAULTS["video-model"].inputPorts ?? []
const DEFAULT_OUTPUT_PORTS =
  WORKFLOW_NODE_DEFAULTS["video-model"].outputPorts ?? []

export function WorkflowVideoModelNode({
  nodeId,
  title = WORKFLOW_NODE_DEFAULTS["video-model"].title,
  modelKey = WORKFLOW_NODE_DEFAULTS["video-model"].modelKey,
  inputPorts = DEFAULT_INPUT_PORTS,
  outputPorts = DEFAULT_OUTPUT_PORTS,
  addInputLabel = WORKFLOW_NODE_DEFAULTS["video-model"].addInputLabel,
  runLabel = WORKFLOW_NODE_DEFAULTS["video-model"].runLabel,
  showAddInputAction = WORKFLOW_NODE_DEFAULTS["video-model"].showAddInputAction,
  showRunAction = WORKFLOW_NODE_DEFAULTS["video-model"].showRunAction,
  isSelected = false,
  executionStatus,
  runtimeError,
  onPortPointerDown,
  onAddInputClick,
  onRunClick,
}: WorkflowVideoModelNodeProps) {
  const isRunning = executionStatus === "running"
  const videoModelDefinition = React.useMemo(
    () => getVideoModelDefinition(modelKey),
    [modelKey]
  )
  const rendererProps = React.useMemo(
    () => ({
      nodeId,
      videoModel:
        videoModelDefinition ??
        ({
          key: modelKey ?? "video-model",
          group: "video-models",
          label: title ?? "Video Model",
          mode: "generate-from-text-or-image",
          menu: {
            category: "Video models",
          },
          createData: () => WORKFLOW_NODE_DEFAULTS["video-model"],
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
      videoModelDefinition,
    ]
  )
  const customFooter =
    videoModelDefinition?.renderer.renderFooter?.(rendererProps)

  return (
    <WorkflowNodeShell
      widthClassName={videoModelDefinition?.renderer.width}
      isSelected={isSelected}
      executionStatus={executionStatus}
      className="gap-4"
    >
      <WorkflowNodeHeader title={title ?? videoModelDefinition?.label} />

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
        {videoModelDefinition?.renderer.renderBody(rendererProps) ?? null}
      </WorkflowNodeBody>

      {customFooter ?? (
        <WorkflowNodeFooter
          leftActions={
            showAddInputAction ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-sm text-sm font-medium text-white/70 shadow-none hover:bg-white/6 hover:text-white"
                onPointerDown={(event) => {
                  event.stopPropagation()
                }}
                onClick={(event) => {
                  event.stopPropagation()
                  onAddInputClick?.()
                }}
              >
                <Plus className="mr-1 size-4" />
                {addInputLabel}
              </Button>
            ) : null
          }
          rightActions={
            showRunAction ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-sm border border-white/6 bg-[#23242d] text-sm font-medium text-white/72 shadow-none hover:border-white/10 hover:bg-[#2a2c36] hover:text-white",
                  isRunning &&
                    "border-sky-400/20 bg-sky-400/10 text-sky-100 hover:border-sky-400/30 hover:bg-sky-400/12"
                )}
                onPointerDown={(event) => {
                  event.stopPropagation()
                }}
                onClick={(event) => {
                  event.stopPropagation()
                  onRunClick?.()
                }}
              >
                <ArrowRight className="mr-1 size-4" />
                {isRunning ? "Running Model" : runLabel}
              </Button>
            ) : null
          }
        />
      )}

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
          style={{ top: `${getVideoModelPortOffset(modelKey, index)}px` }}
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
          style={{ top: `${getVideoModelPortOffset(modelKey, index)}px` }}
          onPortPointerDown={onPortPointerDown}
        />
      ))}
    </WorkflowNodeShell>
  )
}
