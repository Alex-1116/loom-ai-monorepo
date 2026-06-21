"use client"

import * as React from "react"
import { cn } from "@loom/ui/lib/utils"

import type { WorkflowExecutionStatus } from "@/components/workflows/shared/types/workflow-runtime"

export type WorkflowNodeShellProps = React.HTMLAttributes<HTMLDivElement> & {
  widthClassName?: string
  isSelected?: boolean
  isDragging?: boolean
  executionStatus?: WorkflowExecutionStatus
}

const shellToneClassName =
  "border border-white/10 bg-[#1c1d26]/96 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl"

export function WorkflowNodeShell({
  className,
  widthClassName = "w-[352px]",
  isSelected = false,
  isDragging = false,
  executionStatus,
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
        executionStatus === "running" &&
          "border-sky-400/45 bg-sky-400/[0.06] shadow-[0_20px_60px_rgba(14,165,233,0.18)]",
        executionStatus === "succeeded" &&
          "border-emerald-400/35 bg-emerald-400/[0.04] shadow-[0_20px_60px_rgba(52,211,153,0.14)]",
        executionStatus === "failed" &&
          "border-rose-400/40 bg-rose-400/[0.05] shadow-[0_20px_60px_rgba(251,113,133,0.15)]",
        className
      )}
      {...props}
    >
      {executionStatus ? (
        <div
          className={cn(
            "pointer-events-none absolute top-3 right-3 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-[0.18em] uppercase",
            executionStatus === "running" && "bg-sky-400/14 text-sky-100",
            executionStatus === "succeeded" &&
              "bg-emerald-400/14 text-emerald-100",
            executionStatus === "failed" && "bg-rose-400/14 text-rose-100"
          )}
        >
          {executionStatus}
        </div>
      ) : null}
      {children}
    </div>
  )
}

export { WorkflowNodeHeader } from "./workflow-node-header"
export { WorkflowNodeBody } from "./workflow-node-body"
export { WorkflowNodePort } from "./workflow-node-port"
export type { WorkflowNodePortPointerHandler } from "./workflow-node-port"
