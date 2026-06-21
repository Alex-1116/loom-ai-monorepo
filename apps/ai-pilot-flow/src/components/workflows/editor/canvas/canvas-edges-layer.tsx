"use client"

import * as React from "react"

import { cn } from "@loom/ui/lib/utils"

import type {
  WorkflowEdge,
  WorkflowPortRef,
} from "@/components/workflows/editor/model/types/workflow-edge"
import type { WorkflowCanvasNode } from "@/components/workflows/editor/model/types/workflow-node"

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
  previewConnection?: {
    source: WorkflowPortRef
    currentPoint: EdgeAnchor
  } | null
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
        },
      ]
    })

    if (!previewConnection) {
      return persistedEdgePaths
    }

    const sourceNode = nodeMap.get(previewConnection.source.nodeId)
    if (!sourceNode) {
      return persistedEdgePaths
    }

    const sourceNodeSize = nodeSizes[sourceNode.id]
    if (!sourceNodeSize) {
      return persistedEdgePaths
    }

    const source = getEdgeAnchor({
      node: sourceNode,
      nodeSize: sourceNodeSize,
      side: previewConnection.source.side,
    })

    return [
      ...persistedEdgePaths,
      {
        id: "workflow-edge-preview",
        path: createEdgePath(source, previewConnection.currentPoint),
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
          ) : null}
        </g>
      ))}
    </svg>
  )
}
