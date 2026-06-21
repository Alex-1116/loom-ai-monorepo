"use client"

import {
  WorkflowNodeBody,
  WorkflowNodeHeader,
  WorkflowNodePort,
  type WorkflowNodePortPointerHandler,
  WorkflowNodeShell,
} from "@/components/workflows/editor/nodes/shell/workflow-node-shell"
import {
  DEFAULT_PROMPT_NODE_CONTENT,
  WORKFLOW_NODE_DEFAULTS,
} from "@/components/workflows/editor/model/constants/node-defaults"
import { getRequiredWorkflowNodePort } from "@/components/workflows/editor/nodes/registry/workflow-node-registry"
import { Button } from "@loom/ui/components/button"

type WorkflowPromptNodeProps = {
  nodeId: string
  title?: string
  content?: string
  isSelected?: boolean
  onPortPointerDown?: WorkflowNodePortPointerHandler
}

export function WorkflowPromptNode({
  nodeId,
  title = WORKFLOW_NODE_DEFAULTS.prompt.title,
  content = DEFAULT_PROMPT_NODE_CONTENT,
  isSelected = false,
  onPortPointerDown,
}: WorkflowPromptNodeProps) {
  const port = getRequiredWorkflowNodePort("prompt", "output")

  return (
    <WorkflowNodeShell isSelected={isSelected}>
      <WorkflowNodeHeader title={title} />

      <WorkflowNodeBody className="flex flex-col items-start gap-4">
        {/* 当前 prompt 节点主体就是一段可扩展的提示词内容。 */}
        <div className="rounded-[14px] border border-white/6 bg-white/8 p-5">
          <p className="text-[14px] leading-7 text-white/85">{content}</p>
        </div>

        <Button
          type="button"
          variant="ghost"
          className="h-auto w-auto rounded-md px-2 py-1 text-sm font-medium text-white/70 shadow-none hover:bg-white/6 hover:text-white"
        >
          + Add variable
        </Button>
      </WorkflowNodeBody>

      <WorkflowNodePort
        nodeId={nodeId}
        portKey={port.key}
        side={port.side}
        label={title || port.label}
        labelVisibility={port.labelVisibility}
        portToneClassName={port.portToneClassName}
        labelToneClassName={port.labelToneClassName}
        onPortPointerDown={onPortPointerDown}
      />
    </WorkflowNodeShell>
  )
}
