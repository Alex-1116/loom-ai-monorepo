import type { WorkflowDocument } from "@/components/workflows/editor/model/types/workflow-editor"
import type {
  WorkflowCanvasNode,
  WorkflowNodeData,
  WorkflowNodePortData,
} from "@/components/workflows/editor/model/types/workflow-node"
import type {
  WorkflowEdge,
  WorkflowPortRef,
} from "@/components/workflows/editor/model/types/workflow-edge"
import type {
  SharedWorkflowEdge,
  SharedWorkflowGraph,
  SharedWorkflowNode,
  SharedWorkflowNodeData,
  SharedWorkflowNodePortData,
  SharedWorkflowPortRef,
} from "@/components/workflows/shared/types/workflow-runtime"

function toSharedWorkflowPortData(
  port: WorkflowNodePortData
): SharedWorkflowNodePortData {
  return {
    key: port.key,
    label: port.label,
    side: port.side,
    labelVisibility: port.labelVisibility,
    portToneClassName: port.portToneClassName,
    labelToneClassName: port.labelToneClassName,
  }
}

function toSharedWorkflowNodeData(
  data?: WorkflowNodeData
): SharedWorkflowNodeData | undefined {
  if (!data) {
    return undefined
  }

  return {
    title: data.title,
    content: data.content,
    inputLabel: data.inputLabel,
    outputLabel: data.outputLabel,
    secondaryOutputLabel: data.secondaryOutputLabel,
    actionLabel: data.actionLabel,
    modelKey: data.modelKey,
    toolKey: data.toolKey,
    toolCategory: data.toolCategory,
    inputPorts: data.inputPorts?.map(toSharedWorkflowPortData),
    outputPorts: data.outputPorts?.map(toSharedWorkflowPortData),
    addInputLabel: data.addInputLabel,
    runLabel: data.runLabel,
    showAddInputAction: data.showAddInputAction,
    showRunAction: data.showRunAction,
  }
}

function toSharedWorkflowPortRef(port: WorkflowPortRef): SharedWorkflowPortRef {
  return {
    nodeId: port.nodeId,
    side: port.side,
    key: port.key,
  }
}

function toSharedWorkflowNode(node: WorkflowCanvasNode): SharedWorkflowNode {
  return {
    id: node.id,
    type: node.type,
    x: node.x,
    y: node.y,
    data: toSharedWorkflowNodeData(node.data),
  }
}

function toSharedWorkflowEdge(edge: WorkflowEdge): SharedWorkflowEdge {
  return {
    id: edge.id,
    source: toSharedWorkflowPortRef(edge.source),
    target: toSharedWorkflowPortRef(edge.target),
  }
}

export function createSharedWorkflowGraph(
  document: Pick<WorkflowDocument, "nodes" | "edges">
): SharedWorkflowGraph {
  return {
    nodes: document.nodes.map(toSharedWorkflowNode),
    edges: document.edges.map(toSharedWorkflowEdge),
  }
}
