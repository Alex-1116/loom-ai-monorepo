"use client"

import { ArrowRight, Plus, Wrench } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"

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
  title?: string
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
  onRunClick?: () => void
}

const DEFAULT_INPUT_PORTS = WORKFLOW_NODE_DEFAULTS.tool.inputPorts ?? []
const DEFAULT_OUTPUT_PORTS = WORKFLOW_NODE_DEFAULTS.tool.outputPorts ?? []

function getPortOffset(index: number) {
  return 72 + index * 80
}

export function WorkflowToolNode({
  nodeId,
  title = WORKFLOW_NODE_DEFAULTS.tool.title,
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
  onRunClick,
}: WorkflowToolNodeProps) {
  const isRunning = executionStatus === "running"

  return (
    <WorkflowNodeShell
      isSelected={isSelected}
      executionStatus={executionStatus}
      className="gap-4"
    >
      <WorkflowNodeHeader title={title} />

      <WorkflowNodeBody className="w-full">
        <div
          className={cn(
            "relative flex min-h-36 w-full flex-col justify-between overflow-hidden rounded-md border border-white/6 bg-[#1f212b] p-4",
            isRunning &&
              "border-sky-400/25 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.14)]"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="text-[10px] font-semibold tracking-[0.18em] text-white/45 uppercase">
                {toolCategory || "Tool"}
              </div>
              <div className="text-sm font-medium text-white/92">{title}</div>
            </div>
            <div className="rounded-md border border-white/8 bg-white/4 p-2 text-white/70">
              <Wrench className="size-4" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-[11px] text-white/45">
            <span>{inputPorts.length} inputs</span>
            <span>{outputPorts.length} outputs</span>
          </div>

          {isRunning ? (
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1),transparent_60%)]" />
          ) : null}
        </div>
      </WorkflowNodeBody>

      <WorkflowNodeFooter
        leftActions={
          showAddInputAction ? (
            <Button
              type="button"
              variant="ghost"
              className="h-auto w-auto rounded-md px-2 py-1 text-sm font-medium text-white/70 shadow-none hover:bg-white/6 hover:text-white"
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
              className={cn(
                "rounded-md border border-white/6 bg-[#23242d] px-3 py-2 text-sm font-medium text-white/72 shadow-none hover:border-white/10 hover:bg-[#2a2c36] hover:text-white",
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
          style={{ top: `${getPortOffset(index)}px` }}
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
          style={{ top: `${getPortOffset(index)}px` }}
          onPortPointerDown={onPortPointerDown}
        />
      ))}
    </WorkflowNodeShell>
  )
}
