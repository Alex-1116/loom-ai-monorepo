"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"

import { cn } from "@loom/ui/lib/utils"

export type NodeErrorStateProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  icon?: React.ReactNode
  compact?: boolean
}

export function NodeErrorState({
  title = "This node needs attention",
  description = "Please check the configuration or upstream inputs and try again.",
  action,
  icon,
  compact = false,
  className,
  ...props
}: NodeErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex w-full items-start gap-3 rounded-md border border-rose-400/20 bg-rose-500/10 text-rose-50",
        compact ? "p-3" : "p-4",
        className
      )}
      {...props}
    >
      {icon ?? <AlertTriangle className="size-3.5 text-rose-200" />}

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-rose-50">{title}</p>

        {description ? (
          <p className="mt-1 text-sm leading-6 text-rose-100/75">
            {description}
          </p>
        ) : null}

        {action ? <div className="mt-3">{action}</div> : null}
      </div>
    </div>
  )
}
