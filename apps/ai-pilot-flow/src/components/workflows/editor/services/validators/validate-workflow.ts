import type { WorkflowEdge } from "@/components/workflows/editor/model/types/workflow-edge"
import type { ViewportState } from "@/components/workflows/editor/model/types/viewport"
import type { WorkflowCanvasNode } from "@/components/workflows/editor/model/types/workflow-node"
import { getWorkflowNodePortsForNode } from "@/components/workflows/editor/nodes/registry/workflow-node-registry"
import {
  validateNode,
  type WorkflowValidationIssue,
} from "@/components/workflows/editor/services/validators/validate-node"

export type ValidateWorkflowInput = {
  nodes: WorkflowCanvasNode[]
  edges?: WorkflowEdge[]
  viewport?: ViewportState
}

export type ValidateWorkflowResult = {
  isValid: boolean
  issues: WorkflowValidationIssue[]
}

function createIssue(
  level: WorkflowValidationIssue["level"],
  code: string,
  message: string
): WorkflowValidationIssue {
  return {
    level,
    code,
    message,
  }
}

function formatPortRef(edge: WorkflowEdge, anchor: "source" | "target") {
  const port = edge[anchor]
  return port.key ? `${port.nodeId}.${port.key}` : `${port.nodeId}.${port.side}`
}

function resolveEdgePort(
  node: WorkflowCanvasNode,
  edge: WorkflowEdge,
  anchor: "source" | "target"
) {
  const portRef = edge[anchor]
  const nodePorts = getWorkflowNodePortsForNode(node)
  const sidePorts = nodePorts.filter((port) => port.side === portRef.side)

  if (portRef.key) {
    const port = nodePorts.find((candidate) => candidate.key === portRef.key)
    if (!port) {
      return {
        port: null,
        issues: [
          createIssue(
            "error",
            `workflow.edge.${anchor}.missing-port`,
            `Edge ${edge.id} references missing ${anchor} port: ${formatPortRef(edge, anchor)}`
          ),
        ],
      }
    }

    if (port.side !== portRef.side) {
      return {
        port: null,
        issues: [
          createIssue(
            "error",
            `workflow.edge.${anchor}.port-side-mismatch`,
            `Edge ${edge.id} references ${anchor} port ${formatPortRef(edge, anchor)} with mismatched side ${portRef.side}.`
          ),
        ],
      }
    }

    return {
      port,
      issues: [],
    }
  }

  if (sidePorts.length === 1) {
    return {
      port: sidePorts[0],
      issues: [],
    }
  }

  if (sidePorts.length === 0) {
    return {
      port: null,
      issues: [
        createIssue(
          "error",
          `workflow.edge.${anchor}.missing-side-port`,
          `Edge ${edge.id} references node ${node.id} ${anchor} side ${portRef.side}, but the node has no port on that side.`
        ),
      ],
    }
  }

  return {
    port: null,
    issues: [
      createIssue(
        "error",
        `workflow.edge.${anchor}.ambiguous-port`,
        `Edge ${edge.id} references node ${node.id} ${anchor} side ${portRef.side} without a port key, but multiple ports exist on that side.`
      ),
    ],
  }
}

function detectWorkflowCycles(
  nodes: WorkflowCanvasNode[],
  edges: WorkflowEdge[]
) {
  const nodeIds = new Set(nodes.map((node) => node.id))
  const adjacency = new Map<string, Set<string>>()
  const indegree = new Map<string, number>()
  const edgeKeys = new Set<string>()

  nodes.forEach((node) => {
    adjacency.set(node.id, new Set())
    indegree.set(node.id, 0)
  })

  edges.forEach((edge) => {
    const sourceId = edge.source.nodeId
    const targetId = edge.target.nodeId

    if (
      sourceId === targetId ||
      !nodeIds.has(sourceId) ||
      !nodeIds.has(targetId)
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

  const queue = nodes
    .map((node) => node.id)
    .filter((nodeId) => (indegree.get(nodeId) ?? 0) === 0)
  const visited = new Set<string>()

  while (queue.length > 0) {
    const nodeId = queue.shift()
    if (!nodeId) {
      continue
    }

    visited.add(nodeId)
    adjacency.get(nodeId)?.forEach((nextNodeId) => {
      const nextIndegree = (indegree.get(nextNodeId) ?? 0) - 1
      indegree.set(nextNodeId, nextIndegree)
      if (nextIndegree === 0) {
        queue.push(nextNodeId)
      }
    })
  }

  return nodes
    .map((node) => node.id)
    .filter(
      (nodeId) => !visited.has(nodeId) && (adjacency.get(nodeId)?.size ?? 0) > 0
    )
}

export function validateWorkflow({
  nodes,
  edges = [],
  viewport,
}: ValidateWorkflowInput): ValidateWorkflowResult {
  const issues: WorkflowValidationIssue[] = []
  const nodeIds = new Set<string>()
  const nodeMap = new Map<string, WorkflowCanvasNode>()
  const edgeIds = new Set<string>()
  const edgeConnectionKeys = new Set<string>()
  const validSemanticEdges: WorkflowEdge[] = []

  for (const node of nodes) {
    if (nodeIds.has(node.id)) {
      issues.push(
        createIssue(
          "error",
          "workflow.node-id.duplicate",
          `Duplicate node id detected: ${node.id}`
        )
      )
      continue
    }

    nodeIds.add(node.id)
    nodeMap.set(node.id, node)
    issues.push(...validateNode(node).issues)
  }

  for (const edge of edges) {
    if (edgeIds.has(edge.id)) {
      issues.push(
        createIssue(
          "error",
          "workflow.edge-id.duplicate",
          `Duplicate edge id detected: ${edge.id}`
        )
      )
      continue
    }

    edgeIds.add(edge.id)

    const sourceNode = nodeMap.get(edge.source.nodeId)
    if (!sourceNode) {
      issues.push(
        createIssue(
          "error",
          "workflow.edge.source.missing-node",
          `Edge ${edge.id} references missing source node: ${edge.source.nodeId}`
        )
      )
    }

    const targetNode = nodeMap.get(edge.target.nodeId)
    if (!targetNode) {
      issues.push(
        createIssue(
          "error",
          "workflow.edge.target.missing-node",
          `Edge ${edge.id} references missing target node: ${edge.target.nodeId}`
        )
      )
    }

    if (!sourceNode || !targetNode) {
      continue
    }

    if (edge.source.nodeId === edge.target.nodeId) {
      issues.push(
        createIssue(
          "error",
          "workflow.edge.self-loop",
          `Edge ${edge.id} cannot connect node ${edge.source.nodeId} to itself.`
        )
      )
      continue
    }

    const sourceResolution = resolveEdgePort(sourceNode, edge, "source")
    const targetResolution = resolveEdgePort(targetNode, edge, "target")
    issues.push(...sourceResolution.issues, ...targetResolution.issues)

    if (!sourceResolution.port || !targetResolution.port) {
      continue
    }

    if (sourceResolution.port.side !== "right") {
      issues.push(
        createIssue(
          "error",
          "workflow.edge.source.invalid-direction",
          `Edge ${edge.id} must start from an output port, but ${formatPortRef(edge, "source")} is on the ${sourceResolution.port.side} side.`
        )
      )
    }

    if (targetResolution.port.side !== "left") {
      issues.push(
        createIssue(
          "error",
          "workflow.edge.target.invalid-direction",
          `Edge ${edge.id} must end at an input port, but ${formatPortRef(edge, "target")} is on the ${targetResolution.port.side} side.`
        )
      )
    }

    const isDirectionValid =
      sourceResolution.port.side === "right" &&
      targetResolution.port.side === "left"

    const connectionKey = [
      edge.source.nodeId,
      sourceResolution.port.key,
      edge.target.nodeId,
      targetResolution.port.key,
    ].join("::")

    if (edgeConnectionKeys.has(connectionKey)) {
      issues.push(
        createIssue(
          "error",
          "workflow.edge.connection.duplicate",
          `Duplicate edge connection detected between ${formatPortRef(edge, "source")} and ${formatPortRef(edge, "target")}.`
        )
      )
      continue
    }

    edgeConnectionKeys.add(connectionKey)
    if (isDirectionValid) {
      validSemanticEdges.push(edge)
    }
  }

  const cycleNodeIds = detectWorkflowCycles(nodes, validSemanticEdges)
  if (cycleNodeIds.length > 0) {
    issues.push(
      createIssue(
        "error",
        "workflow.graph.cycle-detected",
        `Workflow graph contains a cycle involving: ${cycleNodeIds.join(", ")}`
      )
    )
  }

  if (viewport) {
    if (
      !Number.isFinite(viewport.x) ||
      !Number.isFinite(viewport.y) ||
      !Number.isFinite(viewport.scale)
    ) {
      issues.push(
        createIssue(
          "error",
          "workflow.viewport.invalid",
          "Viewport values must be finite numbers."
        )
      )
    }

    if (viewport.scale <= 0) {
      issues.push(
        createIssue(
          "error",
          "workflow.viewport.scale.invalid",
          "Viewport scale must be greater than zero."
        )
      )
    }
  }

  return {
    isValid: issues.every((issue) => issue.level !== "error"),
    issues,
  }
}
