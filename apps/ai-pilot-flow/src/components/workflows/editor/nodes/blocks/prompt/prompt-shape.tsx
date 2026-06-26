"use client"

import { Plus } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { Textarea } from "@loom/ui/components/textarea"
import { cn } from "@loom/ui/lib/utils"

import type { PromptRendererProps } from "@/components/workflows/editor/model/constants/prompt-definitions"
import { WorkflowNodeFooter } from "@/components/workflows/editor/nodes/shell/workflow-node-shell"

export function renderPromptBody({
  content,
  isRunning,
  onContentChange,
  onContentCommit,
}: PromptRendererProps) {
  return (
    <div className="w-full">
      <Textarea
        value={content ?? ""}
        onChange={(event) => {
          onContentChange?.(event.target.value)
        }}
        onBlur={onContentCommit}
        placeholder="Write your prompt here"
        className={cn(
          "min-h-[260px] resize-none rounded-xl border border-white/6 bg-white/6 px-5 py-4 text-[18px] leading-6 text-white/92 placeholder:text-white/35",
          isRunning &&
            "border-sky-400/20 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.1)]"
        )}
      />
    </div>
  )
}

export function renderPromptFooter({
  addInputLabel,
  showAddInputAction,
  onAddVariableClick,
}: PromptRendererProps) {
  return (
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
              onAddVariableClick?.()
            }}
          >
            <Plus className="mr-1 size-4" />
            {addInputLabel}
          </Button>
        ) : null
      }
    />
  )
}
