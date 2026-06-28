"use client"

import * as React from "react"
import { ArrowRight, Plus } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"

import {
  getToolDefinition,
  getToolPortOffset,
} from "@/components/workflows/editor/model/constants/tool-definitions"
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

type WorkflowToolNodeProps = {
  nodeId: string
  toolKey?: string
  title?: string
  content?: string
  toolCategory?: string
  inputPorts?: WorkflowNodePortData[]
  outputPorts?: WorkflowNodePortData[]
  addInputLabel?: string
  runLabel?: string
  showAddInputAction?: boolean
  showRunAction?: boolean
  isSelected?: boolean
  executionStatus?: WorkflowExecutionStatus
  onPortPointerDown?: WorkflowNodePortPointerHandler
  onAddInputClick?: () => void
  onContentChange?: (value: string) => void
  onContentCommit?: () => void
  onRunClick?: () => void
}

const DEFAULT_INPUT_PORTS = WORKFLOW_NODE_DEFAULTS.tool.inputPorts ?? []
const DEFAULT_OUTPUT_PORTS = WORKFLOW_NODE_DEFAULTS.tool.outputPorts ?? []

export function WorkflowToolNode({
  nodeId,
  toolKey = WORKFLOW_NODE_DEFAULTS.tool.toolKey,
  title = WORKFLOW_NODE_DEFAULTS.tool.title,
  content = WORKFLOW_NODE_DEFAULTS.tool.content,
  toolCategory = WORKFLOW_NODE_DEFAULTS.tool.toolCategory,
  inputPorts = DEFAULT_INPUT_PORTS,
  outputPorts = DEFAULT_OUTPUT_PORTS,
  addInputLabel = WORKFLOW_NODE_DEFAULTS.tool.addInputLabel,
  runLabel = WORKFLOW_NODE_DEFAULTS.tool.runLabel,
  showAddInputAction = WORKFLOW_NODE_DEFAULTS.tool.showAddInputAction,
  showRunAction = WORKFLOW_NODE_DEFAULTS.tool.showRunAction,
  isSelected = false,
  executionStatus,
  onPortPointerDown,
  onAddInputClick,
  onContentChange,
  onContentCommit,
  onRunClick,
}: WorkflowToolNodeProps) {
  const isRunning = executionStatus === "running"
  const toolDefinition = React.useMemo(
    () => getToolDefinition(toolKey),
    [toolKey]
  )

  const rendererProps = React.useMemo(
    () => ({
      nodeId,
      tool:
        toolDefinition ??
        ({
          key: toolKey ?? "tool",
          group: "tools",
          label: title ?? "Tool",
          menu: {
            category: toolCategory ?? "Tools",
          },
          createData: () => WORKFLOW_NODE_DEFAULTS.tool,
          renderer: {
            width: "w-[372px]",
            renderBody: () => null,
          },
        } as const),
      title,
      content,
      toolCategory,
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
      onContentChange,
      onContentCommit,
      onRunClick,
    }),
    [
      addInputLabel,
      content,
      executionStatus,
      inputPorts,
      isRunning,
      isSelected,
      nodeId,
      onAddInputClick,
      onContentChange,
      onContentCommit,
      onRunClick,
      outputPorts,
      runLabel,
      showAddInputAction,
      showRunAction,
      title,
      toolCategory,
      toolDefinition,
      toolKey,
    ]
  )

  const customFooter = toolDefinition?.renderer.renderFooter?.(rendererProps)
  const bodyContent = toolDefinition?.renderer.renderBody(rendererProps) ?? null
  const headerTitle: React.ReactNode =
    toolDefinition?.renderer.renderTitle?.(rendererProps) ?? title
  const headerActions: React.ReactNode | undefined =
    toolDefinition?.renderer.renderHeaderActions?.(rendererProps) ?? undefined

  return (
    <WorkflowNodeShell
      widthClassName={toolDefinition?.renderer.width}
      isSelected={isSelected}
      executionStatus={executionStatus}
      className={cn("gap-4", toolDefinition?.renderer.className)}
    >
      <WorkflowNodeHeader title={headerTitle} actions={headerActions} />

      {bodyContent ? (
        <WorkflowNodeBody className="w-full">{bodyContent}</WorkflowNodeBody>
      ) : null}

      {customFooter ?? (
        <WorkflowNodeFooter
          leftActions={
            showAddInputAction ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-sm text-sm font-medium text-white/78 shadow-none hover:bg-white/6 hover:text-white"
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
                  "rounded-sm border border-white/10 bg-white/[0.02] text-sm font-medium text-white/88 shadow-none hover:bg-white/[0.05] hover:text-white",
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
                {isRunning ? "Running Tool" : runLabel}
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
          style={{ top: `${getToolPortOffset(toolKey, index)}px` }}
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
          style={{ top: `${getToolPortOffset(toolKey, index)}px` }}
          onPortPointerDown={onPortPointerDown}
        />
      ))}
    </WorkflowNodeShell>
  )
}
