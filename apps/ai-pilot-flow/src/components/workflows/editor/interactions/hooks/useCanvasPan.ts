"use client"

import * as React from "react"

type ViewportState = {
  x: number
  y: number
  scale: number
}

type UseCanvasPanParams = {
  activeTool: "select" | "hand"
  viewport: ViewportState
  setViewport: React.Dispatch<React.SetStateAction<ViewportState>>
  handleTouchPointerDown: (event: React.PointerEvent<HTMLDivElement>) => boolean
  handleTouchPointerMove: (event: React.PointerEvent<HTMLDivElement>) => boolean
  handleTouchPointerEnd: (event?: React.PointerEvent<HTMLDivElement>) => boolean
}

type DragState = {
  pointerId: number
  startX: number
  startY: number
  originX: number
  originY: number
} | null

export function useCanvasPan({
  activeTool,
  viewport,
  setViewport,
  handleTouchPointerDown,
  handleTouchPointerMove,
  handleTouchPointerEnd,
}: UseCanvasPanParams) {
  const dragStateRef = React.useRef<DragState>(null)
  const [isPanning, setIsPanning] = React.useState(false)

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if ((event.target as HTMLElement).closest("[data-workflow-overlay]")) {
        return
      }

      if ((event.target as HTMLElement).closest("[data-workflow-node]")) {
        return
      }

      if (handleTouchPointerDown(event)) {
        return
      }

      // 中键拖拽或 hand 工具都可以进入平移模式。
      const shouldPanWithButton = event.button === 1 || activeTool === "hand"
      if (!shouldPanWithButton) {
        return
      }

      dragStateRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: viewport.x,
        originY: viewport.y,
      }
      setIsPanning(true)
      event.currentTarget.setPointerCapture(event.pointerId)
      event.preventDefault()
    },
    [activeTool, handleTouchPointerDown, viewport.x, viewport.y]
  )

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (handleTouchPointerMove(event)) {
        return
      }

      const dragState = dragStateRef.current
      if (!dragState || dragState.pointerId !== event.pointerId) {
        return
      }

      const deltaX = event.clientX - dragState.startX
      const deltaY = event.clientY - dragState.startY

      // 平移直接修改 viewport 偏移，不改变世界坐标里的节点数据。
      setViewport((current) => ({
        ...current,
        x: dragState.originX + deltaX,
        y: dragState.originY + deltaY,
      }))
    },
    [handleTouchPointerMove, setViewport]
  )

  const handlePointerEnd = React.useCallback(
    (event?: React.PointerEvent<HTMLDivElement>) => {
      if (handleTouchPointerEnd(event)) {
        return
      }

      if (event && dragStateRef.current?.pointerId === event.pointerId) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      dragStateRef.current = null
      setIsPanning(false)
    },
    [handleTouchPointerEnd]
  )

  return {
    isPanning,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
  }
}
