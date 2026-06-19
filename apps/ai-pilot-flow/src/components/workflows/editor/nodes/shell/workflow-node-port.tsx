"use client"

import * as React from "react"

import { cn } from "@loom/ui/lib/utils"
import { NodeHoverLabel } from "@/components/workflows/editor/nodes/shared/node-hover-label"

export type WorkflowNodePortProps = React.HTMLAttributes<HTMLDivElement> & {
  side?: "left" | "right"
  label?: React.ReactNode
  labelVisibility?: "always" | "hover"
  tone?: "default" | "prompt"
  align?: "center" | "start"
  portToneClassName?: string
  labelToneClassName?: string
}

export function WorkflowNodePort({
  side = "right",
  label,
  labelVisibility = "hover",
  tone = "default",
  align = "center",
  portToneClassName = "border-white/80 bg-[#1c1d26]",
  labelToneClassName = "text-white/70",
  className,
  ...props
}: WorkflowNodePortProps) {
  // 现在只覆盖当前项目里的两种主形态：左输入口和右输出口。
  const sidePositionClassName =
    side === "right"
      ? align === "start"
        ? "right-0 top-6 translate-x-1/2"
        : "top-1/2 -right-2.5 -translate-y-1/2"
      : align === "start"
        ? "left-0 top-6 -translate-x-1/2"
        : "top-1/2 -left-2.5 -translate-y-1/2"

  const labelOffsetClassName =
    side === "right"
      ? "bottom-auto left-6 right-auto -top-3 mb-0 translate-x-0"
      : "bottom-auto right-6 left-auto -top-3 mb-0 translate-x-0"

  return (
    <div
      className={cn(
        "absolute flex items-center gap-3",
        sidePositionClassName,
        className
      )}
      {...props}
    >
      {side === "left" && label ? (
        <NodeHoverLabel
          side="top"
          visibility={labelVisibility}
          className={labelOffsetClassName}
          toneClassName={cn(
            "border-transparent bg-transparent p-0 shadow-none",
            labelToneClassName
          )}
        >
          {label}
        </NodeHoverLabel>
      ) : null}

      <div className={cn("size-5 rounded-full border-2", portToneClassName)} />

      {side === "right" && label ? (
        <NodeHoverLabel
          side="top"
          visibility={labelVisibility}
          className={labelOffsetClassName}
          toneClassName={cn(
            "border-transparent bg-transparent p-0 shadow-none",
            labelToneClassName
          )}
        >
          {label}
        </NodeHoverLabel>
      ) : null}
    </div>
  )
}
