"use client"

import { ArrowRight, Plus } from "lucide-react"

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

type WorkflowThreeDModelNodeProps = {
  nodeId: string
  title?: string
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

const DEFAULT_INPUT_PORTS = WORKFLOW_NODE_DEFAULTS["3d-model"].inputPorts ?? []
const DEFAULT_OUTPUT_PORTS =
  WORKFLOW_NODE_DEFAULTS["3d-model"].outputPorts ?? []

function getPortOffset(index: number) {
  return 72 + index * 80
}

export function WorkflowThreeDModelNode({
  nodeId,
  title = WORKFLOW_NODE_DEFAULTS["3d-model"].title,
  inputPorts = DEFAULT_INPUT_PORTS,
  outputPorts = DEFAULT_OUTPUT_PORTS,
  addInputLabel = WORKFLOW_NODE_DEFAULTS["3d-model"].addInputLabel,
  runLabel = WORKFLOW_NODE_DEFAULTS["3d-model"].runLabel,
  showAddInputAction = WORKFLOW_NODE_DEFAULTS["3d-model"].showAddInputAction,
  showRunAction = WORKFLOW_NODE_DEFAULTS["3d-model"].showRunAction,
  isSelected = false,
  executionStatus,
  onPortPointerDown,
  onAddInputClick,
  onRunClick,
}: WorkflowThreeDModelNodeProps) {
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
            "relative aspect-square w-full overflow-hidden rounded-md bg-[#1f212b]",
            "bg-[radial-gradient(circle_at_50%_35%,rgba(106,152,255,0.16),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_55%),linear-gradient(0deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03))]",
            isRunning &&
              "border-sky-400/25 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.14)]"
          )}
        >
          <div className="pointer-events-none absolute inset-6 rounded-full border border-white/8" />
          <div className="pointer-events-none absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-white/8" />
          <div className="pointer-events-none absolute inset-y-8 left-1/2 w-px -translate-x-1/2 bg-white/8" />
          <div className="pointer-events-none absolute inset-[22%] rounded-[28%] border border-[#8ab4ff]/35 bg-[#8ab4ff]/6 shadow-[0_0_42px_rgba(59,130,246,0.12)]" />

          {isRunning ? (
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_60%)]" />
          ) : null}

          <div className="pointer-events-none absolute right-4 bottom-4 left-4 flex items-center justify-between text-[10px] font-semibold tracking-[0.18em] uppercase">
            <span
              className={cn("text-white/24", isRunning && "text-sky-100/70")}
            >
              {isRunning ? "Meshing" : "3D Workspace"}
            </span>
            {isRunning ? (
              <span className="rounded-full bg-sky-400/14 px-2 py-0.5 text-sky-100">
                Running
              </span>
            ) : null}
          </div>
        </div>
      </WorkflowNodeBody>

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
