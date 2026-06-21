"use client"

import {
  WorkflowNodeBody,
  WorkflowNodeHeader,
  WorkflowNodePort,
  type WorkflowNodePortPointerHandler,
  WorkflowNodeShell,
} from "@/components/workflows/editor/nodes/shell/workflow-node-shell"
import { WORKFLOW_NODE_DEFAULTS } from "@/components/workflows/editor/model/constants/node-defaults"
import { getRequiredWorkflowNodePort } from "@/components/workflows/editor/nodes/registry/workflow-node-registry"
import { Input } from "@loom/ui/components/input"
import { Upload } from "lucide-react"

type WorkflowFileNodeProps = {
  nodeId: string
  title?: string
  isSelected?: boolean
  onPortPointerDown?: WorkflowNodePortPointerHandler
}

export function WorkflowFileNode({
  nodeId,
  title = WORKFLOW_NODE_DEFAULTS.file.title,
  isSelected = false,
  onPortPointerDown,
}: WorkflowFileNodeProps) {
  const port = getRequiredWorkflowNodePort("file", "output")

  return (
    <WorkflowNodeShell isSelected={isSelected}>
      <WorkflowNodeHeader title={title} />

      <WorkflowNodeBody>
        {/* 文件节点主体分成上传面板和链接输入两块区域。 */}
        <div className="flex w-full flex-col gap-4 rounded-[14px] border border-white/6 bg-[#20222d] p-4">
          <div
            className="flex h-[324px] items-center justify-center rounded-[12px] border border-white/6"
            style={{
              backgroundImage:
                "linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.03) 75%, rgba(255,255,255,0.03)), linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.03) 75%, rgba(255,255,255,0.03))",
              backgroundPosition: "0 0, 12px 12px",
              backgroundSize: "24px 24px",
            }}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex size-9 items-center justify-center rounded-full border border-white/12 bg-white/4">
                <Upload className="size-4 text-white/80" />
              </div>
              <p className="text-sm text-white/72">
                Drag & drop or click to upload
              </p>
            </div>
          </div>

          <Input
            value="Paste a file link"
            readOnly
            className="rounded-[10px] border-white/6 bg-white/4 text-sm text-white/45"
          />
        </div>
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
