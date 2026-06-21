import type { WorkflowEdge } from "@/components/workflows/editor/model/types/workflow-edge"
import type { WorkflowCanvasNode } from "@/components/workflows/editor/model/types/workflow-node"

export type AutoLayoutDirection = "horizontal" | "vertical"

export type AutoLayoutOptions = {
  direction?: AutoLayoutDirection
  startX?: number
  startY?: number
  gapX?: number
  gapY?: number
  edges?: WorkflowEdge[]
}

const DEFAULT_HORIZONTAL_GAP = 420
const DEFAULT_VERTICAL_GAP = 260

function layoutSequentially(
  nodes: WorkflowCanvasNode[],
  options: Required<
    Pick<AutoLayoutOptions, "direction" | "startX" | "startY" | "gapX" | "gapY">
  >
) {
  const { direction, startX, startY, gapX, gapY } = options

  return nodes.map((node, index) => {
    if (direction === "vertical") {
      return {
        ...node,
        x: startX,
        y: startY + index * gapY,
      }
    }

    return {
      ...node,
      x: startX + index * gapX,
      y: startY,
    }
  })
}

function getLayerRanks(nodes: WorkflowCanvasNode[], edges: WorkflowEdge[]) {
  const nodeIdSet = new Set(nodes.map((node) => node.id))
  const adjacency = new Map<string, Set<string>>()
  const indegree = new Map<string, number>()
  const order = new Map<string, number>()
  const ranks = new Map<string, number>()
  const edgeKeys = new Set<string>()

  nodes.forEach((node, index) => {
    adjacency.set(node.id, new Set())
    indegree.set(node.id, 0)
    order.set(node.id, index)
    ranks.set(node.id, 0)
  })

  edges.forEach((edge) => {
    const sourceId = edge.source.nodeId
    const targetId = edge.target.nodeId

    if (
      sourceId === targetId ||
      !nodeIdSet.has(sourceId) ||
      !nodeIdSet.has(targetId)
    ) {
      return
    }

    const edgeKey = `${sourceId}::${targetId}`
    if (edgeKeys.has(edgeKey)) {
      return
    }

    edgeKeys.add(edgeKey)
    adjacency.get(sourceId)?.add(targetId)
    indegree.set(targetId, (indegree.get(targetId) ?? 0) + 1)
  })

  if (edgeKeys.size === 0) {
    return null
  }

  const queue = nodes
    .map((node) => node.id)
    .filter((nodeId) => (indegree.get(nodeId) ?? 0) === 0)

  const visited = new Set<string>()

  while (queue.length > 0) {
    queue.sort(
      (left, right) => (order.get(left) ?? 0) - (order.get(right) ?? 0)
    )
    const currentId = queue.shift()
    if (!currentId || visited.has(currentId)) {
      continue
    }

    visited.add(currentId)

    adjacency.get(currentId)?.forEach((nextId) => {
      ranks.set(
        nextId,
        Math.max(ranks.get(nextId) ?? 0, (ranks.get(currentId) ?? 0) + 1)
      )

      const nextIndegree = (indegree.get(nextId) ?? 0) - 1
      indegree.set(nextId, nextIndegree)
      if (nextIndegree === 0) {
        queue.push(nextId)
      }
    })
  }

  const unresolvedIds = nodes
    .map((node) => node.id)
    .filter((nodeId) => !visited.has(nodeId))

  if (unresolvedIds.length > 0) {
    const maxResolvedRank = Math.max(...ranks.values(), 0)

    unresolvedIds.forEach((nodeId, index) => {
      // Cycles cannot be topologically sorted, so place the remaining nodes
      // in later layers to keep the layout deterministic and readable.
      ranks.set(nodeId, maxResolvedRank + index + 1)
    })
  }

  return ranks
}

export function autoLayout(
  nodes: WorkflowCanvasNode[],
  options: AutoLayoutOptions = {}
): WorkflowCanvasNode[] {
  const {
    direction = "horizontal",
    startX = 0,
    startY = 0,
    gapX = DEFAULT_HORIZONTAL_GAP,
    gapY = DEFAULT_VERTICAL_GAP,
    edges = [],
  } = options

  const layoutOptions = {
    direction,
    startX,
    startY,
    gapX,
    gapY,
  } as const

  if (nodes.length <= 1) {
    return layoutSequentially(nodes, layoutOptions)
  }

  const ranks = getLayerRanks(nodes, edges)
  if (!ranks) {
    return layoutSequentially(nodes, layoutOptions)
  }

  const layers = new Map<number, WorkflowCanvasNode[]>()
  nodes.forEach((node) => {
    const rank = ranks.get(node.id) ?? 0
    const currentLayer = layers.get(rank)

    if (currentLayer) {
      currentLayer.push(node)
      return
    }

    layers.set(rank, [node])
  })

  return nodes.map((node) => {
    const rank = ranks.get(node.id) ?? 0
    const layerNodes = layers.get(rank) ?? [node]
    const laneIndex = layerNodes.findIndex(
      (layerNode) => layerNode.id === node.id
    )

    if (direction === "vertical") {
      return {
        ...node,
        x: startX + laneIndex * gapX,
        y: startY + rank * gapY,
      }
    }

    return {
      ...node,
      x: startX + rank * gapX,
      y: startY + laneIndex * gapY,
    }
  })
}
