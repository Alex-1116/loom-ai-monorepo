"use client"

import * as React from "react"

type CanvasNodePosition = {
  id: string
  x: number
  y: number
}

type DragState = {
  nodeId: string
  pointerId: number
  startClientX: number
  startClientY: number
  originX: number
  originY: number
} | null

type UseCanvasNodeDragParams = {
  scale: number
  onNodePositionChange: (
    nodeId: string,
    position: { x: number; y: number }
  ) => void
  onDragEnd?: () => void
}

const INTERACTIVE_NODE_SELECTOR =
  'button, input, textarea, select, option, a, label, summary, [role="button"], [data-workflow-node-interactive]'

export function useCanvasNodeDrag({
  scale,
  onNodePositionChange,
  onDragEnd,
}: UseCanvasNodeDragParams) {
  const dragStateRef = React.useRef<DragState>(null)
  const scaleRef = React.useRef(scale)
  const onNodePositionChangeRef = React.useRef(onNodePositionChange)
  const onDragEndRef = React.useRef(onDragEnd)
  const [draggingNodeId, setDraggingNodeId] = React.useState<string | null>(
    null
  )

  React.useEffect(() => {
    scaleRef.current = scale
  }, [scale])

  React.useEffect(() => {
    onNodePositionChangeRef.current = onNodePositionChange
  }, [onNodePositionChange])

  React.useEffect(() => {
    onDragEndRef.current = onDragEnd
  }, [onDragEnd])

  React.useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const dragState = dragStateRef.current
      if (!dragState || dragState.pointerId !== event.pointerId) {
        return
      }

      // 节点位置存的是世界坐标，所以拖拽位移需要除以当前缩放值。
      const deltaX = (event.clientX - dragState.startClientX) / scaleRef.current
      const deltaY = (event.clientY - dragState.startClientY) / scaleRef.current

      onNodePositionChangeRef.current(dragState.nodeId, {
        x: dragState.originX + deltaX,
        y: dragState.originY + deltaY,
      })

      event.preventDefault()
    }

    const stopDragging = (event: PointerEvent) => {
      const dragState = dragStateRef.current
      if (!dragState || dragState.pointerId !== event.pointerId) {
        return
      }

      dragStateRef.current = null
      setDraggingNodeId(null)
      onDragEndRef.current?.()
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", stopDragging)
    window.addEventListener("pointercancel", stopDragging)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", stopDragging)
      window.removeEventListener("pointercancel", stopDragging)
    }
  }, [])

  const handleNodePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLElement>, node: CanvasNodePosition) => {
      if (event.button !== 0 || event.pointerType === "touch") {
        return
      }

      if ((event.target as HTMLElement).closest(INTERACTIVE_NODE_SELECTOR)) {
        return
      }

      // 只记录拖拽起点，后续实际位置计算全部交给全局 pointermove。
      dragStateRef.current = {
        nodeId: node.id,
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        originX: node.x,
        originY: node.y,
      }
      setDraggingNodeId(node.id)
      event.preventDefault()
      event.stopPropagation()
    },
    []
  )

  return {
    draggingNodeId,
    handleNodePointerDown,
  }
}
