"use client"

import * as React from "react"
import { FlipHorizontal2, FlipVertical2, RotateCcw } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"
import { WorkflowNodeFooter } from "@/components/workflows/editor/nodes/shell/workflow-node-shell"

function ToolIconButton({ children }: React.PropsWithChildren) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className="rounded-sm text-white/55 shadow-none hover:bg-white/6 hover:text-white"
      onPointerDown={(event) => {
        event.stopPropagation()
      }}
      onClick={(event) => {
        event.stopPropagation()
      }}
    >
      {children}
    </Button>
  )
}

export function renderRotateAndFlipBody({ isRunning }: ToolRendererProps) {
  return (
    <div className="relative w-full">
      <div
        className={cn(
          "aspect-square w-full rounded-[14px] bg-[#1f212b]",
          isRunning && "shadow-[inset_0_0_0_1px_rgba(56,189,248,0.14)]"
        )}
        style={{
          backgroundImage:
            "linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.04) 75%, rgba(255,255,255,0.04)), linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.04) 75%, rgba(255,255,255,0.04))",
          backgroundPosition: "0 0, 12px 12px",
          backgroundSize: "24px 24px",
        }}
      />

      {isRunning ? (
        <div className="pointer-events-none absolute inset-0 rounded-[14px] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_60%)]" />
      ) : null}
    </div>
  )
}

export function renderRotateAndFlipFooter({ isRunning }: ToolRendererProps) {
  return (
    <WorkflowNodeFooter
      leftActions={
        <div className="flex items-center gap-1">
          <ToolIconButton>
            <RotateCcw className="size-4" />
          </ToolIconButton>
          <ToolIconButton>
            <FlipHorizontal2 className="size-4" />
          </ToolIconButton>
          <ToolIconButton>
            <FlipVertical2 className="size-4" />
          </ToolIconButton>
        </div>
      }
      rightActions={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-sm text-sm font-medium text-white/72 shadow-none hover:bg-white/6 hover:text-white",
            isRunning && "text-sky-100"
          )}
          onPointerDown={(event) => {
            event.stopPropagation()
          }}
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          Reset
        </Button>
      }
    />
  )
}
