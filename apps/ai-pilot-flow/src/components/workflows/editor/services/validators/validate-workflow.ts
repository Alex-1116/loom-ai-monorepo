import type { WorkflowEdge } from "@/components/workflows/editor/model/types/workflow-edge"
import type { ViewportState } from "@/components/workflows/editor/model/types/viewport"
import type { WorkflowCanvasNode } from "@/components/workflows/editor/model/types/workflow-node"
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

export function validateWorkflow({
  nodes,
  edges = [],
  viewport,
}: ValidateWorkflowInput): ValidateWorkflowResult {
  const issues: WorkflowValidationIssue[] = []
  const nodeIds = new Set<string>()
  const edgeIds = new Set<string>()

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

    if (!nodeIds.has(edge.source.nodeId)) {
      issues.push(
        createIssue(
          "error",
          "workflow.edge.source.missing-node",
          `Edge ${edge.id} references missing source node: ${edge.source.nodeId}`
        )
      )
    }

    if (!nodeIds.has(edge.target.nodeId)) {
      issues.push(
        createIssue(
          "error",
          "workflow.edge.target.missing-node",
          `Edge ${edge.id} references missing target node: ${edge.target.nodeId}`
        )
      )
    }
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
