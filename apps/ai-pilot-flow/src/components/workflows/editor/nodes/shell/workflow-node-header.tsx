"use client"

import * as React from "react"
import { Ellipsis } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"

export type WorkflowNodeHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  title: React.ReactNode
  actions?: React.ReactNode
  showDefaultActions?: boolean
}

export function WorkflowNodeHeader({
  title,
  actions,
  showDefaultActions = true,
  className,
  ...props
}: WorkflowNodeHeaderProps) {
  return (
    <div
      className={cn("flex w-full items-center justify-between", className)}
      {...props}
    >
      <span className="text-sm font-medium text-white/75">{title}</span>

      {/* 外部没有传 actions 时，统一兜底一个更多按钮，保证节点头部形态稳定。 */}
      {actions ??
        (showDefaultActions ? (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label={`${title} 更多操作`}
            className="rounded-md text-white/50 shadow-none hover:bg-white/6 hover:text-white"
          >
            <Ellipsis className="size-4" />
          </Button>
        ) : null)}
    </div>
  )
}
