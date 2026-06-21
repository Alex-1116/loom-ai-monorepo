import type {
  SharedWorkflowGraph,
  SharedWorkflowNode,
} from "@/components/workflows/shared/types/workflow-runtime"

export type WorkflowExecutionPlan = {
  orderedNodeIds: string[]
  orderedNodes: SharedWorkflowNode[]
}

export function createWorkflowExecutionPlan(
  graph: SharedWorkflowGraph
): WorkflowExecutionPlan {
  const nodeIds = new Set(graph.nodes.map((node) => node.id))
  const nodeMap = new Map(graph.nodes.map((node) => [node.id, node]))
  const order = new Map(graph.nodes.map((node, index) => [node.id, index]))
  const adjacency = new Map<string, Set<string>>()
  const indegree = new Map<string, number>()
  const edgeKeys = new Set<string>()

  graph.nodes.forEach((node) => {
    adjacency.set(node.id, new Set())
    indegree.set(node.id, 0)
  })

  graph.edges.forEach((edge) => {
    if (
      edge.source.nodeId === edge.target.nodeId ||
      !nodeIds.has(edge.source.nodeId) ||
      !nodeIds.has(edge.target.nodeId)
    ) {
      return
    }

    const edgeKey = `${edge.source.nodeId}::${edge.target.nodeId}`
    if (edgeKeys.has(edgeKey)) {
      return
    }

    edgeKeys.add(edgeKey)
    adjacency.get(edge.source.nodeId)?.add(edge.target.nodeId)
    indegree.set(
      edge.target.nodeId,
      (indegree.get(edge.target.nodeId) ?? 0) + 1
    )
  })

  const queue = graph.nodes
    .map((node) => node.id)
    .filter((nodeId) => (indegree.get(nodeId) ?? 0) === 0)

  const orderedNodeIds: string[] = []

  while (queue.length > 0) {
    queue.sort(
      (left, right) => (order.get(left) ?? 0) - (order.get(right) ?? 0)
    )
    const currentNodeId = queue.shift()
    if (!currentNodeId) {
      continue
    }

    orderedNodeIds.push(currentNodeId)

    adjacency.get(currentNodeId)?.forEach((nextNodeId) => {
      const nextIndegree = (indegree.get(nextNodeId) ?? 0) - 1
      indegree.set(nextNodeId, nextIndegree)
      if (nextIndegree === 0) {
        queue.push(nextNodeId)
      }
    })
  }

  const unresolvedNodeIds = graph.nodes
    .map((node) => node.id)
    .filter((nodeId) => !orderedNodeIds.includes(nodeId))

  const finalOrderedNodeIds = [...orderedNodeIds, ...unresolvedNodeIds]

  return {
    orderedNodeIds: finalOrderedNodeIds,
    orderedNodes: finalOrderedNodeIds.flatMap((nodeId) => {
      const node = nodeMap.get(nodeId)
      return node ? [node] : []
    }),
  }
}
