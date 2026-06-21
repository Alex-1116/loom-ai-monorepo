"use client"

import * as React from "react"

import { cn } from "@loom/ui/lib/utils"

import type {
  WorkflowEdge,
  WorkflowPortRef,
} from "@/components/workflows/editor/model/types/workflow-edge"
import type { WorkflowCanvasNode } from "@/components/workflows/editor/model/types/workflow-node"
import type { EdgeConnectionPreview } from "@/components/workflows/editor/interactions/hooks/useCanvasEdgeConnection"

type WorkflowCanvasNodeSize = {
  width: number
  height: number
}

type WorkflowCanvasEdgesLayerProps = {
  nodes: WorkflowCanvasNode[]
  nodeSizes: Record<string, WorkflowCanvasNodeSize>
  edges: WorkflowEdge[]
  selectedEdgeIds?: string[]
  onSelectEdge?: (edgeId: string) => void
  onReconnectEdgePointerDown?: (
    event: React.PointerEvent<SVGCircleElement>,
    edgeId: string,
    anchor: "source" | "target",
    port: WorkflowPortRef
  ) => void
  previewConnection?: EdgeConnectionPreview
}

type EdgeAnchor = {
  x: number
  y: number
}

function getEdgeAnchor({
  node,
  nodeSize,
  side,
}: {
  node: WorkflowCanvasNode
  nodeSize: WorkflowCanvasNodeSize
  side: WorkflowEdge["source"]["side"]
}): EdgeAnchor {
  return {
    x: side === "right" ? node.x + nodeSize.width : node.x,
    y: node.y + nodeSize.height / 2,
  }
}

function createEdgePath(source: EdgeAnchor, target: EdgeAnchor) {
  const deltaX = target.x - source.x
  const controlOffset = Math.max(48, Math.abs(deltaX) * 0.4)
  const sourceControlX =
    source.x + (deltaX >= 0 ? controlOffset : controlOffset * 0.6)
  const targetControlX =
    target.x - (deltaX >= 0 ? controlOffset : controlOffset * 0.6)

  return `M ${source.x} ${source.y} C ${sourceControlX} ${source.y}, ${targetControlX} ${target.y}, ${target.x} ${target.y}`
}

export function WorkflowCanvasEdgesLayer({
  nodes,
  nodeSizes,
  edges,
  selectedEdgeIds = [],
  onSelectEdge,
  onReconnectEdgePointerDown,
  previewConnection = null,
}: WorkflowCanvasEdgesLayerProps) {
  const [hoveredEdgeId, setHoveredEdgeId] = React.useState<string | null>(null)
  const nodeMap = React.useMemo(
    () => new Map(nodes.map((node) => [node.id, node])),
    [nodes]
  )
  const selectedEdgeIdSet = React.useMemo(
    () => new Set(selectedEdgeIds),
    [selectedEdgeIds]
  )

  const edgePaths = React.useMemo(() => {
    const persistedEdgePaths = edges.flatMap((edge) => {
      if (previewConnection?.edgeId === edge.id) {
        return []
      }

      const sourceNode = nodeMap.get(edge.source.nodeId)
      const targetNode = nodeMap.get(edge.target.nodeId)
      if (!sourceNode || !targetNode) {
        return []
      }

      const sourceNodeSize = nodeSizes[sourceNode.id]
      const targetNodeSize = nodeSizes[targetNode.id]
      if (!sourceNodeSize || !targetNodeSize) {
        return []
      }

      const source = getEdgeAnchor({
        node: sourceNode,
        nodeSize: sourceNodeSize,
        side: edge.source.side,
      })
      const target = getEdgeAnchor({
        node: targetNode,
        nodeSize: targetNodeSize,
        side: edge.target.side,
      })

      return [
        {
          id: edge.id,
          path: createEdgePath(source, target),
          isSelected: selectedEdgeIdSet.has(edge.id),
          isHovered: hoveredEdgeId === edge.id,
          tone: "persisted" as const,
          source,
          target,
          sourcePort: edge.source,
          targetPort: edge.target,
        },
      ]
    })

    if (!previewConnection) {
      return persistedEdgePaths
    }

    const anchorNode = nodeMap.get(previewConnection.anchorPort.nodeId)
    if (!anchorNode) {
      return persistedEdgePaths
    }

    const anchorNodeSize = nodeSizes[anchorNode.id]
    if (!anchorNodeSize) {
      return persistedEdgePaths
    }

    const anchor = getEdgeAnchor({
      node: anchorNode,
      nodeSize: anchorNodeSize,
      side: previewConnection.anchorPort.side,
    })

    return [
      ...persistedEdgePaths,
      {
        id: "workflow-edge-preview",
        path:
          previewConnection.mode === "from-source"
            ? createEdgePath(anchor, previewConnection.currentPoint)
            : createEdgePath(previewConnection.currentPoint, anchor),
        isSelected: false,
        isHovered: false,
        tone: "preview" as const,
      },
    ]
  }, [
    edges,
    hoveredEdgeId,
    nodeMap,
    nodeSizes,
    previewConnection,
    selectedEdgeIdSet,
  ])

  if (edgePaths.length === 0) {
    return null
  }

  return (
    <svg
      className="absolute top-0 left-0"
      height="1"
      style={{ overflow: "visible" }}
      width="1"
    >
      <defs>
        <filter
          id="workflow-edge-glow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur result="blur" stdDeviation="2.5" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {edgePaths.map((edgePath) => (
        <g key={edgePath.id}>
          <path
            d={edgePath.path}
            fill="none"
            stroke={
              edgePath.tone === "preview"
                ? "rgba(56, 189, 248, 0.18)"
                : edgePath.isSelected || edgePath.isHovered
                  ? "rgba(96, 165, 250, 0.22)"
                  : "rgba(15, 23, 42, 0.18)"
            }
            strokeLinecap="round"
            strokeDasharray={edgePath.tone === "preview" ? "10 8" : undefined}
            strokeWidth={edgePath.isSelected || edgePath.isHovered ? 8 : 6}
          />
          <path
            className={cn(
              edgePath.tone === "preview"
                ? "opacity-100"
                : edgePath.isSelected || edgePath.isHovered
                  ? "opacity-100"
                  : "opacity-90"
            )}
            d={edgePath.path}
            fill="none"
            filter="url(#workflow-edge-glow)"
            stroke={
              edgePath.tone === "preview"
                ? "#38bdf8"
                : edgePath.isSelected || edgePath.isHovered
                  ? "#60a5fa"
                  : "#94a3b8"
            }
            strokeLinecap="round"
            strokeDasharray={edgePath.tone === "preview" ? "10 8" : undefined}
            strokeWidth={edgePath.isSelected || edgePath.isHovered ? 3 : 2}
          />
          {edgePath.tone === "persisted" ? (
            <>
              <path
                data-workflow-edge-hit="true"
                d={edgePath.path}
                fill="none"
                pointerEvents="stroke"
                stroke="transparent"
                strokeLinecap="round"
                strokeWidth={18}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  onSelectEdge?.(edgePath.id)
                }}
                onPointerDown={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                }}
                onPointerEnter={() => setHoveredEdgeId(edgePath.id)}
                onPointerLeave={() =>
                  setHoveredEdgeId((current) =>
                    current === edgePath.id ? null : current
                  )
                }
              />
              {edgePath.isSelected || edgePath.isHovered ? (
                <>
                  <circle
                    cx={edgePath.source.x}
                    cy={edgePath.source.y}
                    r={5.5}
                    data-workflow-edge-hit="true"
                    fill="#1d1e27"
                    pointerEvents="all"
                    stroke="#60a5fa"
                    strokeWidth={2}
                    onPointerDown={(event) =>
                      onReconnectEdgePointerDown?.(
                        event,
                        edgePath.id,
                        "source",
                        edgePath.sourcePort
                      )
                    }
                  />
                  <circle
                    cx={edgePath.target.x}
                    cy={edgePath.target.y}
                    r={5.5}
                    data-workflow-edge-hit="true"
                    fill="#1d1e27"
                    pointerEvents="all"
                    stroke="#60a5fa"
                    strokeWidth={2}
                    onPointerDown={(event) =>
                      onReconnectEdgePointerDown?.(
                        event,
                        edgePath.id,
                        "target",
                        edgePath.targetPort
                      )
                    }
                  />
                </>
              ) : null}
            </>
          ) : null}
        </g>
      ))}
    </svg>
  )
}
