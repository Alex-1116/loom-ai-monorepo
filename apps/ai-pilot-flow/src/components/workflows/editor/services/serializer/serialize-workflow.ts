import type { ViewportState } from "@/components/workflows/editor/interactions/utils/viewport"
import type {
  WorkflowCanvasNode,
  WorkflowNodeType,
} from "@/components/workflows/editor/nodes/registry/workflow-node-registry"

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
  viewport: ViewportState
}

export type SerializeWorkflowInput = {
  nodes: WorkflowCanvasNode[]
  viewport: ViewportState
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
  viewport,
}: SerializeWorkflowInput): SerializedWorkflowDocument {
  return {
    version: WORKFLOW_DOCUMENT_VERSION,
    nodes: nodes.map(cloneNode),
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
