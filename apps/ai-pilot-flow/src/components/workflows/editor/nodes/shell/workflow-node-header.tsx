"use client"

import * as React from "react"
import { Ellipsis } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"
import {
  NodeStatusBadge,
  type NodeStatusBadgeProps,
} from "@/components/workflows/editor/nodes/shared/node-status-badge"

export type WorkflowNodeHeaderProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> & {
  title: React.ReactNode
  actions?: React.ReactNode
  showDefaultActions?: boolean
  statusBadge?: NodeStatusBadgeProps | null
}

export function WorkflowNodeHeader({
  title,
  actions,
  showDefaultActions = true,
  statusBadge,
  className,
  ...props
}: WorkflowNodeHeaderProps) {
  return (
    <div
      className={cn("flex w-full items-center justify-between", className)}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="truncate text-sm font-medium text-white/75">
          {title}
        </span>
        {statusBadge ? (
          <NodeStatusBadge
            {...statusBadge}
            className={cn("shrink-0", statusBadge.className)}
          />
        ) : null}
      </div>

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
