"use client"

import * as React from "react"

import {
  getSnappedNodePosition,
  type SnapGuides,
} from "@/components/workflows/editor/interactions/utils/snapping"

type CanvasNodePosition = {
  id: string
  x: number
  y: number
}

type CanvasNodeSize = {
  width: number
  height: number
}

type UseCanvasSnappingParams<Node extends CanvasNodePosition> = {
  viewport: {
    x: number
    y: number
    scale: number
  }
  nodesRef: React.RefObject<Node[]>
  nodeSizesRef: React.RefObject<Record<string, CanvasNodeSize>>
  setNodes: (updater: React.SetStateAction<Node[]>) => void
}

function createEmptyGuides(): SnapGuides {
  return {
    verticalGuide: null,
    horizontalGuide: null,
  }
}

export function useCanvasSnapping<Node extends CanvasNodePosition>({
  viewport,
  nodesRef,
  nodeSizesRef,
  setNodes,
}: UseCanvasSnappingParams<Node>) {
  const [guides, setGuides] = React.useState<SnapGuides>(createEmptyGuides)

  const clearGuides = React.useCallback(() => {
    setGuides(createEmptyGuides())
  }, [])

  const handleNodePositionChange = React.useCallback(
    (nodeId: string, position: { x: number; y: number }) => {
      const currentNodes = nodesRef.current ?? []
      const currentNodeSizes = nodeSizesRef.current ?? {}
      const nodeSize = currentNodeSizes[nodeId] ?? null
      // 缩放越大，屏幕上的同一段像素距离对应的世界坐标阈值越小。
      const safeScale = Math.max(viewport.scale, 0.01)
      const snapThreshold = 24 / safeScale

      const snapResult = getSnappedNodePosition({
        activeNodeId: nodeId,
        position,
        nodeSize,
        nodes: currentNodes
          .map((node) => {
            const size = currentNodeSizes[node.id]
            if (!size) {
              return null
            }

            return {
              id: node.id,
              x: node.x,
              y: node.y,
              width: size.width,
              height: size.height,
            }
          })
          .filter((node): node is NonNullable<typeof node> => Boolean(node)),
        threshold: snapThreshold,
        // 屏幕中心是固定的 overlay 点，需要先换回世界坐标才能参与吸附计算。
        verticalTargets: [-viewport.x / safeScale],
        horizontalTargets: [-viewport.y / safeScale],
      })

      setGuides(snapResult.guides)
      setNodes((current) =>
        current.map((node) =>
          node.id === nodeId ? { ...node, ...snapResult.position } : node
        )
      )
    },
    [nodeSizesRef, nodesRef, setNodes, viewport.scale, viewport.x, viewport.y]
  )

  return {
    guides,
    clearGuides,
    handleNodePositionChange,
  }
}
