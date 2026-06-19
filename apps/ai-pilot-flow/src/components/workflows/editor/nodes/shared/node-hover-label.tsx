"use client"

import * as React from "react"

import { cn } from "@loom/ui/lib/utils"

export type NodeHoverLabelProps = React.HTMLAttributes<HTMLSpanElement> & {
  visibility?: "always" | "hover"
  side?: "left" | "right" | "top" | "bottom"
  toneClassName?: string
}

const sideClassNames = {
  left: "top-1/2 right-full mr-3 -translate-y-1/2",
  right: "top-1/2 left-full ml-3 -translate-y-1/2",
  top: "bottom-full left-1/2 mb-3 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-3 -translate-x-1/2",
} as const

export function NodeHoverLabel({
  visibility = "hover",
  side = "top",
  toneClassName = "border-white/10 bg-[#171821]/96 text-white/72",
  className,
  children,
  ...props
}: NodeHoverLabelProps) {
  if (!children) {
    return null
  }

  return (
    <span
      className={cn(
        "pointer-events-none absolute z-10 rounded-md border px-2 py-1 text-xs font-medium whitespace-nowrap shadow-[0_8px_24px_rgba(0,0,0,0.3)]",
        sideClassNames[side],
        toneClassName,
        visibility === "hover" &&
          "opacity-0 transition-opacity duration-150 group-hover:opacity-100",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
