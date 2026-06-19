"use client"

import * as React from "react"

import { cn } from "@loom/ui/lib/utils"
import {
  NodeErrorState,
  type NodeErrorStateProps,
} from "@/components/workflows/editor/nodes/shared/node-error-state"

export type WorkflowNodeBodyProps = React.HTMLAttributes<HTMLDivElement> & {
  errorState?: NodeErrorStateProps | null
  errorStateMode?: "prepend" | "replace"
}

export function WorkflowNodeBody({
  errorState,
  errorStateMode = "prepend",
  className,
  children,
  ...props
}: WorkflowNodeBodyProps) {
  return (
    <div
      // body 只提供内容区容器，具体布局完全交给各个节点自己决定。
      className={cn(
        "h-auto w-full",
        errorState && errorStateMode === "prepend" && "flex flex-col gap-3",
        className
      )}
      {...props}
    >
      {errorState ? <NodeErrorState {...errorState} /> : null}
      {errorStateMode === "replace" && errorState ? null : children}
    </div>
  )
}
