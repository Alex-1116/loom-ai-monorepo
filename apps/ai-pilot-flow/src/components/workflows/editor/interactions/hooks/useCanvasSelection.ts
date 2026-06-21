"use client"

import * as React from "react"

import {
  getElementRelativePoint,
  getElementSize,
  type Point,
} from "@/components/workflows/editor/interactions/utils/pointer"
import { getSurfaceCenter } from "@/components/workflows/editor/interactions/utils/viewport"

type CanvasNodePosition = {
  id: string
  x: number
  y: number
}

type CanvasNodeSize = {
  width: number
  height: number
}

type SelectionState = {
  pointerId: number
  startPoint: Point
  currentPoint: Point
  additive: boolean
  initialSelectedNodeIds: string[]
} | null

type SelectionBox = {
  left: number
  top: number
  width: number
  height: number
} | null

type UseCanvasSelectionParams<Node extends CanvasNodePosition> = {
  surfaceRef: React.RefObject<HTMLDivElement | null>
  activeTool: "select" | "hand"
  viewport: {
    x: number
    y: number
    scale: number
  }
  nodesRef: React.RefObject<Node[]>
  nodeSizesRef: React.RefObject<Record<string, CanvasNodeSize>>
  selectedNodeIds: string[]
  setSelectedNodeIds: (nodeIds: string[]) => void
  clearSecondarySelection?: () => void
}

const MIN_SELECTION_DRAG_DISTANCE = 4
const PERSISTED_SELECTION_PADDING = 5

function createSelectionBox(
  startPoint: Point,
  currentPoint: Point
): SelectionBox {
  return {
    left: Math.min(startPoint.x, currentPoint.x),
    top: Math.min(startPoint.y, currentPoint.y),
    width: Math.abs(currentPoint.x - startPoint.x),
    height: Math.abs(currentPoint.y - startPoint.y),
  }
}

function intersects(
  left: { left: number; top: number; width: number; height: number },
  right: { left: number; top: number; width: number; height: number }
) {
  return (
    left.left < right.left + right.width &&
    left.left + left.width > right.left &&
    left.top < right.top + right.height &&
    left.top + left.height > right.top
  )
}

function isAdditiveSelection(event: React.PointerEvent<HTMLDivElement>) {
  return event.shiftKey || event.metaKey || event.ctrlKey
}

export function useCanvasSelection<Node extends CanvasNodePosition>({
  surfaceRef,
  activeTool,
  viewport,
  nodesRef,
  nodeSizesRef,
  selectedNodeIds,
  setSelectedNodeIds,
  clearSecondarySelection,
}: UseCanvasSelectionParams<Node>) {
  const selectionStateRef = React.useRef<SelectionState>(null)
  const [selectionBox, setSelectionBox] = React.useState<SelectionBox>(null)
  const [persistedSelectionBox, setPersistedSelectionBox] =
    React.useState<SelectionBox>(null)
  const [isSelectionOverlayVisible, setIsSelectionOverlayVisible] =
    React.useState(false)

  const handleSelectionPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (activeTool !== "select" || event.button !== 0) {
        return false
      }

      if (event.pointerType === "touch") {
        return false
      }

      const target = event.target as HTMLElement
      if (
        target.closest("[data-workflow-overlay]") ||
        target.closest("[data-workflow-node]")
      ) {
        return false
      }

      const point = getElementRelativePoint(surfaceRef.current, event)
      if (!point) {
        return false
      }

      selectionStateRef.current = {
        pointerId: event.pointerId,
        startPoint: point,
        currentPoint: point,
        additive: isAdditiveSelection(event),
        initialSelectedNodeIds: selectedNodeIds,
      }
      setPersistedSelectionBox(null)
      setIsSelectionOverlayVisible(true)
      setSelectionBox(createSelectionBox(point, point))
      event.currentTarget.setPointerCapture(event.pointerId)
      event.preventDefault()

      return true
    },
    [activeTool, selectedNodeIds, surfaceRef]
  )

  const handleSelectionPointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const selectionState = selectionStateRef.current
      if (!selectionState || selectionState.pointerId !== event.pointerId) {
        return false
      }

      const point = getElementRelativePoint(surfaceRef.current, event)
      if (!point) {
        return true
      }

      selectionStateRef.current = {
        ...selectionState,
        currentPoint: point,
      }
      setSelectionBox(createSelectionBox(selectionState.startPoint, point))
      event.preventDefault()

      return true
    },
    [surfaceRef]
  )

  const handleSelectionPointerEnd = React.useCallback(
    (event?: React.PointerEvent<HTMLDivElement>) => {
      const selectionState = selectionStateRef.current
      if (!selectionState) {
        return false
      }

      if (event && selectionState.pointerId !== event.pointerId) {
        return false
      }

      const surfaceSize = getElementSize(surfaceRef.current)
      const selection = createSelectionBox(
        selectionState.startPoint,
        selectionState.currentPoint
      )
      const dragDistance = Math.hypot(
        selectionState.currentPoint.x - selectionState.startPoint.x,
        selectionState.currentPoint.y - selectionState.startPoint.y
      )

      if (
        event &&
        event.currentTarget.hasPointerCapture(selectionState.pointerId)
      ) {
        event.currentTarget.releasePointerCapture(selectionState.pointerId)
      }

      if (
        !surfaceSize ||
        !selection ||
        dragDistance < MIN_SELECTION_DRAG_DISTANCE
      ) {
        if (!selectionState.additive) {
          setSelectedNodeIds([])
          clearSecondarySelection?.()
        }

        selectionStateRef.current = null
        setIsSelectionOverlayVisible(false)
        setPersistedSelectionBox(null)
        setSelectionBox(null)
        return true
      }

      const center = getSurfaceCenter(surfaceSize)
      const safeScale = Math.max(viewport.scale, 0.01)
      const selectedNodeBounds = (nodesRef.current ?? []).flatMap((node) => {
        const nodeSize = nodeSizesRef.current?.[node.id]
        if (!nodeSize) {
          return []
        }

        const nodeBounds = {
          id: node.id,
          left: center.x + viewport.x + node.x * safeScale,
          top: center.y + viewport.y + node.y * safeScale,
          width: nodeSize.width * safeScale,
          height: nodeSize.height * safeScale,
        }

        return intersects(selection, nodeBounds) ? [nodeBounds] : []
      })
      const selectedIds = selectedNodeBounds.map((node) => node.id)
      const persistedSelection =
        selectedNodeBounds.length > 0
          ? {
              left:
                Math.min(...selectedNodeBounds.map((node) => node.left)) -
                PERSISTED_SELECTION_PADDING,
              top:
                Math.min(...selectedNodeBounds.map((node) => node.top)) -
                PERSISTED_SELECTION_PADDING,
              width:
                Math.max(
                  ...selectedNodeBounds.map((node) => node.left + node.width)
                ) -
                Math.min(...selectedNodeBounds.map((node) => node.left)) +
                PERSISTED_SELECTION_PADDING * 2,
              height:
                Math.max(
                  ...selectedNodeBounds.map((node) => node.top + node.height)
                ) -
                Math.min(...selectedNodeBounds.map((node) => node.top)) +
                PERSISTED_SELECTION_PADDING * 2,
            }
          : selection

      if (selectionState.additive) {
        clearSecondarySelection?.()
        setSelectedNodeIds(
          Array.from(
            new Set([...selectionState.initialSelectedNodeIds, ...selectedIds])
          )
        )
      } else {
        clearSecondarySelection?.()
        setSelectedNodeIds(selectedIds)
      }

      selectionStateRef.current = null
      setIsSelectionOverlayVisible(true)
      setPersistedSelectionBox(persistedSelection)
      setSelectionBox(null)
      return true
    },
    [
      clearSecondarySelection,
      nodeSizesRef,
      nodesRef,
      setSelectedNodeIds,
      surfaceRef,
      viewport,
    ]
  )

  return {
    isSelectionOverlayVisible,
    selectionBox,
    persistedSelectionBox,
    handleSelectionPointerDown,
    handleSelectionPointerMove,
    handleSelectionPointerEnd,
  }
}
