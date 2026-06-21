"use client"

import * as React from "react"

import type {
  WorkflowEdge,
  WorkflowPortRef,
} from "@/components/workflows/editor/model/types/workflow-edge"
import {
  getElementRelativePoint,
  getElementSize,
  type Point,
} from "@/components/workflows/editor/interactions/utils/pointer"
import { getSurfaceCenter } from "@/components/workflows/editor/interactions/utils/viewport"

type EdgeConnectionPreview = {
  source: WorkflowPortRef
  currentPoint: Point
} | null

type UseCanvasEdgeConnectionParams = {
  surfaceRef: React.RefObject<HTMLDivElement | null>
  viewport: {
    x: number
    y: number
    scale: number
  }
  edges: WorkflowEdge[]
  setEdges: (
    updater: React.SetStateAction<WorkflowEdge[]>,
    historyMode?: "skip" | "deferred" | "commit"
  ) => void
  setSelectedEdgeIds: (
    edgeIds: string[],
    historyMode?: "skip" | "deferred" | "commit"
  ) => void
}

type ActiveConnectionState = {
  pointerId: number
  source: WorkflowPortRef
} | null

const PORT_SELECTOR = "[data-workflow-port='true']"

function createEdgeId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID()
  }

  return `edge-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function getWorldPointFromClientPosition({
  surface,
  viewport,
  clientX,
  clientY,
}: {
  surface: HTMLDivElement | null
  viewport: UseCanvasEdgeConnectionParams["viewport"]
  clientX: number
  clientY: number
}) {
  const surfacePoint = getElementRelativePoint(surface, { clientX, clientY })
  const surfaceSize = getElementSize(surface)
  if (!surfacePoint || !surfaceSize) {
    return null
  }

  const center = getSurfaceCenter(surfaceSize)
  const safeScale = Math.max(viewport.scale, 0.01)

  return {
    x: (surfacePoint.x - center.x - viewport.x) / safeScale,
    y: (surfacePoint.y - center.y - viewport.y) / safeScale,
  }
}

function getPortRefFromElement(
  element: Element | null
): WorkflowPortRef | null {
  const portElement = element?.closest(PORT_SELECTOR)
  if (!(portElement instanceof HTMLElement)) {
    return null
  }

  const { workflowPortNodeId, workflowPortSide, workflowPortKey } =
    portElement.dataset
  if (
    typeof workflowPortNodeId !== "string" ||
    (workflowPortSide !== "left" && workflowPortSide !== "right")
  ) {
    return null
  }

  return {
    nodeId: workflowPortNodeId,
    side: workflowPortSide,
    key: workflowPortKey || undefined,
  }
}

function canCreateEdge(source: WorkflowPortRef, target: WorkflowPortRef) {
  return source.side === "right" && target.side === "left"
}

export function useCanvasEdgeConnection({
  surfaceRef,
  viewport,
  edges,
  setEdges,
  setSelectedEdgeIds,
}: UseCanvasEdgeConnectionParams) {
  const [previewConnection, setPreviewConnection] =
    React.useState<EdgeConnectionPreview>(null)

  const activeConnectionRef = React.useRef<ActiveConnectionState>(null)
  const viewportRef = React.useRef(viewport)
  const edgesRef = React.useRef(edges)
  const setEdgesRef = React.useRef(setEdges)
  const setSelectedEdgeIdsRef = React.useRef(setSelectedEdgeIds)
  const surfaceRefRef = React.useRef(surfaceRef)

  React.useEffect(() => {
    viewportRef.current = viewport
  }, [viewport])

  React.useEffect(() => {
    edgesRef.current = edges
  }, [edges])

  React.useEffect(() => {
    setEdgesRef.current = setEdges
  }, [setEdges])

  React.useEffect(() => {
    setSelectedEdgeIdsRef.current = setSelectedEdgeIds
  }, [setSelectedEdgeIds])

  React.useEffect(() => {
    surfaceRefRef.current = surfaceRef
  }, [surfaceRef])

  React.useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const activeConnection = activeConnectionRef.current
      if (!activeConnection || activeConnection.pointerId !== event.pointerId) {
        return
      }

      const worldPoint = getWorldPointFromClientPosition({
        surface: surfaceRefRef.current.current,
        viewport: viewportRef.current,
        clientX: event.clientX,
        clientY: event.clientY,
      })
      if (!worldPoint) {
        return
      }

      setPreviewConnection({
        source: activeConnection.source,
        currentPoint: worldPoint,
      })
      event.preventDefault()
    }

    const stopConnection = (event: PointerEvent) => {
      const activeConnection = activeConnectionRef.current
      if (!activeConnection || activeConnection.pointerId !== event.pointerId) {
        return
      }

      const targetElement =
        event.target instanceof Element
          ? event.target
          : document.elementFromPoint(event.clientX, event.clientY)
      const targetPort = getPortRefFromElement(targetElement)

      if (
        targetPort &&
        canCreateEdge(activeConnection.source, targetPort) &&
        !edgesRef.current.some(
          (edge) =>
            edge.source.nodeId === activeConnection.source.nodeId &&
            edge.source.side === activeConnection.source.side &&
            edge.source.key === activeConnection.source.key &&
            edge.target.nodeId === targetPort.nodeId &&
            edge.target.side === targetPort.side &&
            edge.target.key === targetPort.key
        )
      ) {
        const edgeId = createEdgeId()
        setEdgesRef.current(
          (current) => [
            ...current,
            {
              id: edgeId,
              source: activeConnection.source,
              target: targetPort,
            },
          ],
          "commit"
        )
        setSelectedEdgeIdsRef.current([])
      }

      activeConnectionRef.current = null
      setPreviewConnection(null)
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", stopConnection)
    window.addEventListener("pointercancel", stopConnection)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", stopConnection)
      window.removeEventListener("pointercancel", stopConnection)
    }
  }, [])

  const handlePortPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>, port: WorkflowPortRef) => {
      if (event.button !== 0 || event.pointerType === "touch") {
        return
      }

      if (port.side !== "right") {
        return
      }

      const worldPoint = getWorldPointFromClientPosition({
        surface: surfaceRef.current,
        viewport,
        clientX: event.clientX,
        clientY: event.clientY,
      })
      if (!worldPoint) {
        return
      }

      activeConnectionRef.current = {
        pointerId: event.pointerId,
        source: port,
      }
      setPreviewConnection({
        source: port,
        currentPoint: worldPoint,
      })
      event.preventDefault()
      event.stopPropagation()
    },
    [surfaceRef, viewport]
  )

  const cancelConnection = React.useCallback(() => {
    activeConnectionRef.current = null
    setPreviewConnection(null)
  }, [])

  return {
    hasActiveConnection: previewConnection !== null,
    previewConnection,
    handlePortPointerDown,
    cancelConnection,
  }
}
