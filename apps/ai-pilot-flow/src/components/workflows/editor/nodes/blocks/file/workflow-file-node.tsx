"use client"

import {
  WorkflowNodeBody,
  WorkflowNodeHeader,
  WorkflowNodePort,
  WorkflowNodeShell,
} from "@/components/workflows/editor/nodes/shell/workflow-node-shell"
import { Input } from "@loom/ui/components/input"
import { Upload } from "lucide-react"

type WorkflowFileNodeProps = {
  title?: string
  isSelected?: boolean
}

export function WorkflowFileNode({
  title = "File",
  isSelected = false,
}: WorkflowFileNodeProps) {
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

      <WorkflowNodePort side="right" label={title} labelVisibility="hover" />
    </WorkflowNodeShell>
  )
}
