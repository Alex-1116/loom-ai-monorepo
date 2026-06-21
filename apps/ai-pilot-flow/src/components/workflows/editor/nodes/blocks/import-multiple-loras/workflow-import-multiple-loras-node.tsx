"use client"

import * as React from "react"
import { Slider } from "@loom/ui/components/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@loom/ui/components/select"

import { WORKFLOW_NODE_DEFAULTS } from "@/components/workflows/editor/model/constants/node-defaults"
import { getRequiredWorkflowNodePort } from "@/components/workflows/editor/nodes/registry/workflow-node-registry"
import {
  WorkflowNodeBody,
  WorkflowNodeHeader,
  WorkflowNodePort,
  type WorkflowNodePortPointerHandler,
  WorkflowNodeShell,
} from "@/components/workflows/editor/nodes/shell/workflow-node-shell"
import type { WorkflowExecutionStatus } from "@/components/workflows/shared/types/workflow-runtime"

const IMPORT_MULTIPLE_LORA_OPTIONS = [
  "LoRA Alpha",
  "LoRA Beta",
  "LoRA Gamma",
] as const

type WorkflowImportMultipleLorasNodeProps = {
  nodeId: string
  title?: string
  outputLabel?: string
  secondaryOutputLabel?: string
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
  isSelected = false,
  executionStatus,
  onPortPointerDown,
}: WorkflowImportMultipleLorasNodeProps) {
  const loraUrlPort = getRequiredWorkflowNodePort(
    "import-multiple-loras",
    "lora-url"
  )
  const weightPort = getRequiredWorkflowNodePort(
    "import-multiple-loras",
    "weight"
  )
  const [weightValue, setWeightValue] = React.useState(0)
  const [selectedLora, setSelectedLora] = React.useState<string>(
    IMPORT_MULTIPLE_LORA_OPTIONS[0]
  )

  return (
    <WorkflowNodeShell
      isSelected={isSelected}
      executionStatus={executionStatus}
    >
      <WorkflowNodeHeader title={title} />

      <WorkflowNodeBody>
        <div className="flex w-full flex-col gap-3">
          <Select value={selectedLora} onValueChange={setSelectedLora}>
            <SelectTrigger
              size="default"
              className="h-10 w-full rounded-[10px] border-white/10 bg-[#23242d] px-4 text-sm text-white/75"
              onPointerDown={(event) => {
                event.stopPropagation()
              }}
            >
              <SelectValue placeholder="Select a LoRA" />
            </SelectTrigger>
            <SelectContent
              className="rounded-[14px] border border-white/10 bg-[#1c1d26] text-white"
              onPointerDown={(event) => {
                event.stopPropagation()
              }}
            >
              {IMPORT_MULTIPLE_LORA_OPTIONS.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="text-white/82 data-[highlighted]:bg-white/70 data-[highlighted]:text-white data-[state=checked]:text-white"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div
            className="flex items-center gap-3"
            onPointerDown={(event) => {
              event.stopPropagation()
            }}
          >
            <span className="w-14 shrink-0 text-sm text-white/78">Weight</span>
            <Slider
              value={[weightValue]}
              onValueChange={(values) => {
                setWeightValue(values[0] ?? 0)
              }}
              min={0}
              max={1}
              step={0.01}
              className="flex-1 [&_[data-slot=slider-range]]:bg-white [&_[data-slot=slider-thumb]]:border-white/70 [&_[data-slot=slider-track]]:bg-white/12"
            />
            <div className="flex h-6 w-16 shrink-0 items-center justify-center rounded-sm border border-white/10 bg-[#23242d] px-3 text-sm text-white/82">
              {weightValue}
            </div>
          </div>
        </div>
      </WorkflowNodeBody>

      <WorkflowNodePort
        nodeId={nodeId}
        portKey={loraUrlPort.key}
        side={loraUrlPort.side}
        label={outputLabel || loraUrlPort.label}
        labelVisibility={loraUrlPort.labelVisibility}
        portToneClassName={loraUrlPort.portToneClassName}
        labelToneClassName={loraUrlPort.labelToneClassName}
        onPortPointerDown={onPortPointerDown}
      />

      <WorkflowNodePort
        nodeId={nodeId}
        portKey={weightPort.key}
        side={weightPort.side}
        label={secondaryOutputLabel || weightPort.label}
        labelVisibility={weightPort.labelVisibility}
        portToneClassName={weightPort.portToneClassName}
        labelToneClassName={weightPort.labelToneClassName}
        className="top-auto right-0 bottom-0 translate-x-1/2 translate-y-1/2"
        onPortPointerDown={onPortPointerDown}
      />
    </WorkflowNodeShell>
  )
}
