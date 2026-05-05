"use client"

import * as React from "react"

import { cn } from "@loom/ui/lib/utils"

export type WorkflowNodeBodyProps = React.HTMLAttributes<HTMLDivElement>

export function WorkflowNodeBody({
  className,
  children,
  ...props
}: WorkflowNodeBodyProps) {
  return (
    <div
      // body 只提供内容区容器，具体布局完全交给各个节点自己决定。
      className={cn("h-auto w-full", className)}
      {...props}
    >
      {children}
    </div>
  )
}
