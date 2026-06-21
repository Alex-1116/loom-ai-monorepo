"use client"

import * as React from "react"

import { type ViewportState } from "@/components/workflows/editor/interactions/utils/viewport"

type UseCanvasViewportControlsParams = {
  setViewport: (updater: React.SetStateAction<ViewportState>) => void
  clearGuides?: () => void
}

export function useCanvasViewportControls({
  setViewport,
  clearGuides,
}: UseCanvasViewportControlsParams) {
  const handleResetView = React.useCallback(() => {
    setViewport({
      x: 0,
      y: 0,
      scale: 1,
    })
    clearGuides?.()
  }, [clearGuides, setViewport])

  return {
    handleResetView,
  }
}
