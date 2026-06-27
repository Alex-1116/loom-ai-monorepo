"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { Textarea } from "@loom/ui/components/textarea"
import { cn } from "@loom/ui/lib/utils"

import { WorkflowNodeFooter } from "@/components/workflows/editor/nodes/shell/workflow-node-shell"
import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

const DEFAULT_PROMPT_TEXT =
  'Hipster Sisyphus, lime overall suit, pushing a huge round rock up a hill. The rock is sprayed with the text "default prompt", bright grey background extreme side long shot, cinematic, fashion style, side view'

function stopPointer(event: React.PointerEvent<HTMLElement>) {
  event.stopPropagation()
}

function stopMouse(event: React.MouseEvent<HTMLElement>) {
  event.stopPropagation()
}

export function renderPromptBody({
  content = DEFAULT_PROMPT_TEXT,
  isRunning,
  onContentChange,
  onContentCommit,
}: ToolRendererProps) {
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
          "min-h-[258px] resize-none rounded-xl border border-white/6 bg-white/6 px-5 py-4 text-sm leading-6 text-white/92 placeholder:text-white/35",
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
  onAddInputClick,
}: ToolRendererProps) {
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
              onAddInputClick?.()
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
