import type { WorkflowEdge } from "@/components/workflows/editor/model/types/workflow-edge"
import type { ViewportState } from "@/components/workflows/editor/model/types/viewport"
import type { WorkflowCanvasNode } from "@/components/workflows/editor/model/types/workflow-node"

export type WorkflowDocument = {
  nodes: WorkflowCanvasNode[]
  edges: WorkflowEdge[]
  viewport: ViewportState
}

export type WorkflowEditorSelection = {
  selectedNodeIds: string[]
  selectedEdgeIds: string[]
}

export type WorkflowEditorSnapshot = WorkflowDocument & WorkflowEditorSelection
