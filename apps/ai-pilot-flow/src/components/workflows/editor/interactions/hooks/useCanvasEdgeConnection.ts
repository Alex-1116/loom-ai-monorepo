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

export type EdgeConnectionPreview = {
  edgeId?: string
  mode: "from-source" | "to-target"
  anchorPort: WorkflowPortRef
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
  mode: "create" | "reconnect-source" | "reconnect-target"
  edgeId?: string
  fixedPort: WorkflowPortRef
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

function isSamePort(left: WorkflowPortRef, right: WorkflowPortRef) {
  return (
    left.nodeId === right.nodeId &&
    left.side === right.side &&
    left.key === right.key
  )
}

function isSameEdgeConnection(
  edge: Pick<WorkflowEdge, "source" | "target">,
  source: WorkflowPortRef,
  target: WorkflowPortRef
) {
  return isSamePort(edge.source, source) && isSamePort(edge.target, target)
}

function createPreviewConnection(
  activeConnection: NonNullable<ActiveConnectionState>,
  currentPoint: Point
): NonNullable<EdgeConnectionPreview> {
  if (activeConnection.mode === "reconnect-source") {
    return {
      edgeId: activeConnection.edgeId,
      mode: "to-target",
      anchorPort: activeConnection.fixedPort,
      currentPoint,
    }
  }

  return {
    edgeId: activeConnection.edgeId,
    mode: "from-source",
    anchorPort: activeConnection.fixedPort,
    currentPoint,
  }
}

function findReconnectEdge(
  edges: WorkflowEdge[],
  edgeId: string
): WorkflowEdge | null {
  return edges.find((edge) => edge.id === edgeId) ?? null
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
        ...createPreviewConnection(activeConnection, worldPoint),
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

      if (targetPort) {
        const nextSource =
          activeConnection.mode === "reconnect-source"
            ? targetPort
            : activeConnection.fixedPort
        const nextTarget =
          activeConnection.mode === "reconnect-source"
            ? activeConnection.fixedPort
            : targetPort
        const reconnectEdge = activeConnection.edgeId
          ? findReconnectEdge(edgesRef.current, activeConnection.edgeId)
          : null
        const hasDuplicateEdge = edgesRef.current.some(
          (edge) =>
            edge.id !== activeConnection.edgeId &&
            isSameEdgeConnection(edge, nextSource, nextTarget)
        )

        if (
          canCreateEdge(nextSource, nextTarget) &&
          !hasDuplicateEdge &&
          (!reconnectEdge ||
            !isSameEdgeConnection(reconnectEdge, nextSource, nextTarget))
        ) {
          if (activeConnection.edgeId) {
            setEdgesRef.current(
              (current) =>
                current.map((edge) =>
                  edge.id === activeConnection.edgeId
                    ? {
                        ...edge,
                        source: nextSource,
                        target: nextTarget,
                      }
                    : edge
                ),
              "commit"
            )
            setSelectedEdgeIdsRef.current([activeConnection.edgeId])
          } else {
            const edgeId = createEdgeId()
            setEdgesRef.current(
              (current) => [
                ...current,
                {
                  id: edgeId,
                  source: nextSource,
                  target: nextTarget,
                },
              ],
              "commit"
            )
            setSelectedEdgeIdsRef.current([])
          }
        } else if (activeConnection.edgeId) {
          setSelectedEdgeIdsRef.current([activeConnection.edgeId])
        }
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
        mode: "create",
        fixedPort: port,
      }
      setPreviewConnection(
        createPreviewConnection(
          {
            pointerId: event.pointerId,
            mode: "create",
            fixedPort: port,
          },
          worldPoint
        )
      )
      event.preventDefault()
      event.stopPropagation()
    },
    [surfaceRef, viewport]
  )

  const handleEdgeReconnectPointerDown = React.useCallback(
    (
      event: React.PointerEvent<SVGCircleElement>,
      edgeId: string,
      anchor: "source" | "target",
      port: WorkflowPortRef
    ) => {
      if (event.button !== 0 || event.pointerType === "touch") {
        return
      }

      const edge = findReconnectEdge(edgesRef.current, edgeId)
      if (!edge) {
        return
      }

      if (
        (anchor === "source" && !isSamePort(edge.source, port)) ||
        (anchor === "target" && !isSamePort(edge.target, port))
      ) {
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

      const activeConnection: NonNullable<ActiveConnectionState> =
        anchor === "source"
          ? {
              pointerId: event.pointerId,
              mode: "reconnect-source",
              edgeId,
              fixedPort: edge.target,
            }
          : {
              pointerId: event.pointerId,
              mode: "reconnect-target",
              edgeId,
              fixedPort: edge.source,
            }

      activeConnectionRef.current = activeConnection
      setPreviewConnection(
        createPreviewConnection(activeConnection, worldPoint)
      )
      setSelectedEdgeIds([edgeId])
      event.preventDefault()
      event.stopPropagation()
    },
    [setSelectedEdgeIds, surfaceRef, viewport]
  )

  const cancelConnection = React.useCallback(() => {
    activeConnectionRef.current = null
    setPreviewConnection(null)
  }, [])

  return {
    hasActiveConnection: previewConnection !== null,
    previewConnection,
    handlePortPointerDown,
    handleEdgeReconnectPointerDown,
    cancelConnection,
  }
}
