"use client"

import * as React from "react"

import { cn } from "@loom/ui/lib/utils"

export type NodeStatusTone =
  | "idle"
  | "draft"
  | "running"
  | "success"
  | "warning"
  | "error"

export type NodeStatusBadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: NodeStatusTone
  label?: React.ReactNode
  showDot?: boolean
}

const toneClassNames: Record<
  NodeStatusTone,
  {
    container: string
    dot: string
    defaultLabel: string
  }
> = {
  idle: {
    container: "border-white/10 bg-white/6 text-white/68",
    dot: "bg-white/45",
    defaultLabel: "Idle",
  },
  draft: {
    container: "border-slate-300/12 bg-slate-300/10 text-slate-200/85",
    dot: "bg-slate-200/80",
    defaultLabel: "Draft",
  },
  running: {
    container: "border-sky-400/20 bg-sky-400/12 text-sky-100",
    dot: "bg-sky-300",
    defaultLabel: "Running",
  },
  success: {
    container: "border-emerald-400/20 bg-emerald-400/12 text-emerald-100",
    dot: "bg-emerald-300",
    defaultLabel: "Ready",
  },
  warning: {
    container: "border-amber-400/20 bg-amber-400/12 text-amber-100",
    dot: "bg-amber-300",
    defaultLabel: "Warning",
  },
  error: {
    container: "border-rose-400/20 bg-rose-400/12 text-rose-100",
    dot: "bg-rose-300",
    defaultLabel: "Error",
  },
}

export function NodeStatusBadge({
  tone = "idle",
  label,
  showDot = true,
  className,
  ...props
}: NodeStatusBadgeProps) {
  const config = toneClassNames[tone]

  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full border px-1.5 text-xs font-medium tracking-normal",
        config.container,
        className
      )}
      {...props}
    >
      {showDot ? (
        <span
          aria-hidden="true"
          className={cn("size-1 rounded-full", config.dot)}
        />
      ) : null}
      <span className="leading-none">{label ?? config.defaultLabel}</span>
    </span>
  )
}
