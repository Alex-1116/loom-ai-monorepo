"use client"

import { Download, Plus, Pencil } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"
import { WorkflowNodeFooter } from "@/components/workflows/editor/nodes/shell/workflow-node-shell"

export function renderCompositorBody({ isRunning }: ToolRendererProps) {
  return (
    <div className="relative w-full">
      <div
        className={cn(
          "relative aspect-square w-full overflow-hidden rounded-[14px] bg-[#1f212b]",
          isRunning && "shadow-[inset_0_0_0_1px_rgba(56,189,248,0.14)]"
        )}
        style={{
          backgroundImage:
            "linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.04) 75%, rgba(255,255,255,0.04)), linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.04) 75%, rgba(255,255,255,0.04))",
          backgroundPosition: "0 0, 12px 12px",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-md border border-white/8 bg-[#2b2d36] text-white/78">
          <Download className="size-4" />
        </div>

        <div className="absolute bottom-4 left-4 text-[13px] font-medium tracking-[0.01em] text-white/88">
          1024x1024
        </div>
      </div>

      {isRunning ? (
        <div className="pointer-events-none absolute inset-0 rounded-[14px] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_60%)]" />
      ) : null}
    </div>
  )
}

export function renderCompositorFooter() {
  return (
    <WorkflowNodeFooter
      leftActions={
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
          }}
        >
          <Plus className="mr-1 size-4" />
          Add layer
        </Button>
      }
      rightActions={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-sm border border-white/10 bg-white/[0.02] text-sm font-medium text-white/88 shadow-none hover:bg-white/[0.05] hover:text-white"
          onPointerDown={(event) => {
            event.stopPropagation()
          }}
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          <Pencil className="mr-1 size-4" />
          Edit
        </Button>
      }
    />
  )
}
