import type { WorkflowEdge } from "@/components/workflows/editor/model/types/workflow-edge"
import type {
  WorkflowCanvasNode,
  WorkflowNodeType,
} from "@/components/workflows/editor/model/types/workflow-node"
import type { ViewportState } from "@/components/workflows/editor/model/types/viewport"

export const WORKFLOW_DOCUMENT_VERSION = 1

export type SerializedWorkflowNode = {
  id: string
  type: WorkflowNodeType
  x: number
  y: number
  data?: WorkflowCanvasNode["data"]
}

export type SerializedWorkflowDocument = {
  version: typeof WORKFLOW_DOCUMENT_VERSION
  nodes: SerializedWorkflowNode[]
  edges: WorkflowEdge[]
  viewport: ViewportState
}

export type SerializeWorkflowInput = {
  nodes: WorkflowCanvasNode[]
  edges?: WorkflowEdge[]
  viewport: ViewportState
}

function cloneEdge(edge: WorkflowEdge): WorkflowEdge {
  return {
    id: edge.id,
    source: { ...edge.source },
    target: { ...edge.target },
  }
}

function cloneNode(node: WorkflowCanvasNode): SerializedWorkflowNode {
  return {
    id: node.id,
    type: node.type,
    x: node.x,
    y: node.y,
    data: node.data ? { ...node.data } : undefined,
  }
}

export function createSerializedWorkflowDocument({
  nodes,
  edges = [],
  viewport,
}: SerializeWorkflowInput): SerializedWorkflowDocument {
  return {
    version: WORKFLOW_DOCUMENT_VERSION,
    nodes: nodes.map(cloneNode),
    edges: edges.map(cloneEdge),
    viewport: {
      x: viewport.x,
      y: viewport.y,
      scale: viewport.scale,
    },
  }
}

export function serializeWorkflow(input: SerializeWorkflowInput) {
  return JSON.stringify(createSerializedWorkflowDocument(input), null, 2)
}
