"use client"

import * as React from "react"

import { cn } from "@loom/ui/lib/utils"

type WorkflowZoomIndicatorProps = {
  scale: number
  className?: string
}

const VISIBILITY_DURATION_MS = 900

function formatZoom(scale: number) {
  return `${Math.round(scale * 100)}%`
}

export function WorkflowZoomIndicator({
  scale,
  className,
}: WorkflowZoomIndicatorProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const hasMountedRef = React.useRef(false)

  React.useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    setIsVisible(true)
    const timer = window.setTimeout(() => {
      setIsVisible(false)
    }, VISIBILITY_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [scale])

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-4 left-1/2 z-20 -translate-x-1/2 transition-all duration-200",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
        className
      )}
      data-workflow-overlay
    >
      <div className="rounded-full border border-white/10 bg-[#171821]/92 px-3 py-1.5 text-sm font-medium text-white shadow-[0_18px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl">
        {formatZoom(scale)}
      </div>
    </div>
  )
}
