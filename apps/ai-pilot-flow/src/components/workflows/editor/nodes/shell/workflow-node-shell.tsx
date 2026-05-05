"use client"

import * as React from "react"
import { cn } from "@loom/ui/lib/utils"

export type WorkflowNodeShellProps = React.HTMLAttributes<HTMLDivElement> & {
  widthClassName?: string
  isSelected?: boolean
  isDragging?: boolean
}

const shellToneClassName =
  "border border-white/10 bg-[#1c1d26]/96 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl"

export function WorkflowNodeShell({
  className,
  widthClassName = "w-[352px]",
  isSelected = false,
  isDragging = false,
  children,
  ...props
}: WorkflowNodeShellProps) {
  return (
    <div
      className={cn(
        // shell 只负责节点通用外壳，不关心具体业务内容。
        "group relative flex flex-col items-start gap-4 rounded-2xl p-4",
        widthClassName,
        shellToneClassName,
        isSelected && "ring-1 ring-white/14",
        isDragging && "shadow-[0_26px_72px_rgba(0,0,0,0.52)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { WorkflowNodeHeader } from "./workflow-node-header"
export { WorkflowNodeBody } from "./workflow-node-body"
export { WorkflowNodePort } from "./workflow-node-port"
