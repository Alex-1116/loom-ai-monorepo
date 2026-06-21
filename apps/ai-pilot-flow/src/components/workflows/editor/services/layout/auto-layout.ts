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

type ValidEdgeConnection = {
  sourceId: string
  targetId: string
}

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

function getValidEdgeConnections(
  nodes: WorkflowCanvasNode[],
  edges: WorkflowEdge[]
): ValidEdgeConnection[] {
  const nodeIdSet = new Set(nodes.map((node) => node.id))
  const edgeKeys = new Set<string>()
  const connections: ValidEdgeConnection[] = []

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
    connections.push({
      sourceId,
      targetId,
    })
  })

  return connections
}

function sortLayerNodesByReferences(
  layerNodes: WorkflowCanvasNode[],
  referenceIdsByNodeId: Map<string, string[]>,
  laneIndexByNodeId: Map<string, number>,
  originalOrder: Map<string, number>
) {
  const getNodeScore = (node: WorkflowCanvasNode) => {
    const referenceIds = referenceIdsByNodeId.get(node.id) ?? []
    const referenceLanes = referenceIds
      .map((referenceId) => laneIndexByNodeId.get(referenceId))
      .filter((laneIndex): laneIndex is number => laneIndex !== undefined)

    if (referenceLanes.length === 0) {
      return originalOrder.get(node.id) ?? 0
    }

    return (
      referenceLanes.reduce((sum, laneIndex) => sum + laneIndex, 0) /
      referenceLanes.length
    )
  }

  return [...layerNodes].sort((left, right) => {
    const scoreDiff = getNodeScore(left) - getNodeScore(right)
    if (scoreDiff !== 0) {
      return scoreDiff
    }

    return (
      (originalOrder.get(left.id) ?? 0) - (originalOrder.get(right.id) ?? 0)
    )
  })
}

function sortLayersByNeighbors(
  layers: Map<number, WorkflowCanvasNode[]>,
  edges: WorkflowEdge[],
  originalOrder: Map<string, number>
) {
  const rankList = Array.from(layers.keys()).sort((left, right) => left - right)
  const validConnections = getValidEdgeConnections(
    Array.from(layers.values()).flat(),
    edges
  )
  const predecessorIdsByNodeId = new Map<string, string[]>()
  const successorIdsByNodeId = new Map<string, string[]>()

  validConnections.forEach(({ sourceId, targetId }) => {
    const predecessorIds = predecessorIdsByNodeId.get(targetId) ?? []
    predecessorIds.push(sourceId)
    predecessorIdsByNodeId.set(targetId, predecessorIds)

    const successorIds = successorIdsByNodeId.get(sourceId) ?? []
    successorIds.push(targetId)
    successorIdsByNodeId.set(sourceId, successorIds)
  })

  const sortedLayers = new Map<number, WorkflowCanvasNode[]>(
    rankList.map((rank) => [
      rank,
      [...(layers.get(rank) ?? [])].sort(
        (left, right) =>
          (originalOrder.get(left.id) ?? 0) - (originalOrder.get(right.id) ?? 0)
      ),
    ])
  )
  const forwardLaneIndexByNodeId = new Map<string, number>()

  rankList.forEach((rank) => {
    const currentLayer = sortedLayers.get(rank) ?? []
    const sortedLayer = sortLayerNodesByReferences(
      currentLayer,
      predecessorIdsByNodeId,
      forwardLaneIndexByNodeId,
      originalOrder
    )

    sortedLayers.set(rank, sortedLayer)
    sortedLayer.forEach((node, laneIndex) => {
      forwardLaneIndexByNodeId.set(node.id, laneIndex)
    })
  })

  const backwardLaneIndexByNodeId = new Map<string, number>()

  Array.from(rankList)
    .reverse()
    .forEach((rank) => {
      const currentLayer = sortedLayers.get(rank) ?? []
      const sortedLayer = sortLayerNodesByReferences(
        currentLayer,
        successorIdsByNodeId,
        backwardLaneIndexByNodeId,
        originalOrder
      )

      sortedLayers.set(rank, sortedLayer)
      sortedLayer.forEach((node, laneIndex) => {
        backwardLaneIndexByNodeId.set(node.id, laneIndex)
      })
    })

  return sortedLayers
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
  const originalOrder = new Map(
    nodes.map((node, index) => [node.id, index] as const)
  )

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

  const sortedLayers = sortLayersByNeighbors(layers, edges, originalOrder)

  return nodes.map((node) => {
    const rank = ranks.get(node.id) ?? 0
    const layerNodes = sortedLayers.get(rank) ?? [node]
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
