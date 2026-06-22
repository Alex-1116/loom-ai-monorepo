"use client"

import * as React from "react"

import { cn } from "@loom/ui/lib/utils"

export type WorkflowNodeFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  leftActions?: React.ReactNode
  rightActions?: React.ReactNode
}

export function WorkflowNodeFooter({
  leftActions,
  rightActions,
  className,
  ...props
}: WorkflowNodeFooterProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-3",
        className
      )}
      {...props}
    >
      <div className="flex min-h-10 items-center">{leftActions}</div>
      <div className="flex min-h-10 items-center">{rightActions}</div>
    </div>
  )
}
