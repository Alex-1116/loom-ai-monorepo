"use client"

import * as React from "react"

type CanvasNodePosition = {
  id: string
  x: number
  y: number
}

type SelectionDragState = {
  pointerId: number
  startClientX: number
  startClientY: number
  originPositions: Map<string, { x: number; y: number }>
} | null

type UseCanvasSelectionDragParams<Node extends CanvasNodePosition> = {
  activeTool: "select" | "hand"
  scale: number
  selectedNodeIds: string[]
  nodesRef: React.RefObject<Node[]>
  setNodes: (updater: React.SetStateAction<Node[]>) => void
  onDragEnd?: () => void
}

export function useCanvasSelectionDrag<Node extends CanvasNodePosition>({
  activeTool,
  scale,
  selectedNodeIds,
  nodesRef,
  setNodes,
  onDragEnd,
}: UseCanvasSelectionDragParams<Node>) {
  const dragStateRef = React.useRef<SelectionDragState>(null)
  const scaleRef = React.useRef(scale)
  const setNodesRef = React.useRef(setNodes)
  const onDragEndRef = React.useRef(onDragEnd)
  const [isDraggingSelection, setIsDraggingSelection] = React.useState(false)

  React.useEffect(() => {
    scaleRef.current = scale
  }, [scale])

  React.useEffect(() => {
    setNodesRef.current = setNodes
  }, [setNodes])

  React.useEffect(() => {
    onDragEndRef.current = onDragEnd
  }, [onDragEnd])

  React.useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const dragState = dragStateRef.current
      if (!dragState || dragState.pointerId !== event.pointerId) {
        return
      }

      const safeScale = Math.max(scaleRef.current, 0.01)
      const deltaX = (event.clientX - dragState.startClientX) / safeScale
      const deltaY = (event.clientY - dragState.startClientY) / safeScale

      setNodesRef.current((current) =>
        current.map((node) => {
          const originPosition = dragState.originPositions.get(node.id)
          if (!originPosition) {
            return node
          }

          return {
            ...node,
            x: originPosition.x + deltaX,
            y: originPosition.y + deltaY,
          }
        })
      )

      event.preventDefault()
    }

    const stopDragging = (event: PointerEvent) => {
      const dragState = dragStateRef.current
      if (!dragState || dragState.pointerId !== event.pointerId) {
        return
      }

      dragStateRef.current = null
      setIsDraggingSelection(false)
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

  const handleSelectionDragPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (
        activeTool !== "select" ||
        event.button !== 0 ||
        event.pointerType === "touch" ||
        selectedNodeIds.length === 0
      ) {
        return
      }

      const selectedNodeIdSet = new Set(selectedNodeIds)
      const originPositions = new Map<string, { x: number; y: number }>()

      for (const node of nodesRef.current ?? []) {
        if (!selectedNodeIdSet.has(node.id)) {
          continue
        }

        originPositions.set(node.id, {
          x: node.x,
          y: node.y,
        })
      }

      if (originPositions.size === 0) {
        return
      }

      dragStateRef.current = {
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        originPositions,
      }
      setIsDraggingSelection(true)
      event.preventDefault()
      event.stopPropagation()
    },
    [activeTool, nodesRef, selectedNodeIds]
  )

  return {
    isDraggingSelection,
    handleSelectionDragPointerDown,
  }
}
