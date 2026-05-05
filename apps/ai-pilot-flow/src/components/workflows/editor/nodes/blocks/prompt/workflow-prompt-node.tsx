"use client"

import {
  WorkflowNodeBody,
  WorkflowNodeHeader,
  WorkflowNodePort,
  WorkflowNodeShell,
} from "@/components/workflows/editor/nodes/shell/workflow-node-shell"
import { Button } from "@loom/ui/components/button"

type WorkflowPromptNodeProps = {
  title?: string
  content?: string
}

const defaultPromptContent =
  'Hipster Sisyphus, lime overall suit, pushing a huge round rock up a hill. The rock is sprayed with the text "default prompt", bright grey background extreme side long shot, cinematic, fashion style, side view'

export function WorkflowPromptNode({
  title = "Prompt",
  content = defaultPromptContent,
}: WorkflowPromptNodeProps) {
  return (
    <WorkflowNodeShell>
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
        side="right"
        label={title}
        labelVisibility="hover"
        portToneClassName="border-[#d88cff] bg-[#1c1d26]"
        labelToneClassName="text-[#d88cff]/70"
      />
    </WorkflowNodeShell>
  )
}
