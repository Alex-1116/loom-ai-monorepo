"use client"

import * as React from "react"

import { Sparkles } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"

import { useCanvasBlockGestures } from "@/components/workflows/editor/interactions/hooks/useCanvasBlockGestures"

type WorkflowEmptyStateProps = {
  visible: boolean
  className?: string
  onCreateFirstNode?: () => void
}

export function WorkflowEmptyState({
  visible,
  className,
  onCreateFirstNode,
}: WorkflowEmptyStateProps) {
  const overlayRef = useCanvasBlockGestures<HTMLDivElement>()

  if (!visible) {
    return null
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-50 flex items-center justify-center px-6",
        className
      )}
      data-workflow-overlay
    >
      <div
        ref={overlayRef}
        className="pointer-events-auto flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#171821]/92 p-8 px-8 py-9 text-center text-white shadow-[0_30px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      >
        <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-300/10 text-sky-200">
          <Sparkles className="size-5" />
        </div>

        <h2 className="text-lg font-semibold text-white">
          开始你的第一个工作流
        </h2>
        <p className="mt-3 text-sm leading-7 text-white/62">
          右键画布可以快速插入节点，也可以直接创建一个 Prompt 节点作为起点。
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Button
            type="button"
            onClick={onCreateFirstNode}
            className="rounded-xl bg-[#eef59a] px-4 text-slate-900 hover:bg-[#eef59a]/90"
          >
            创建第一个 Prompt
          </Button>
          <div className="rounded-xl border border-white/10 bg-white/4 px-3 py-2 text-xs text-white/55">
            或者右键空白处打开节点菜单
          </div>
        </div>
      </div>
    </div>
  )
}
