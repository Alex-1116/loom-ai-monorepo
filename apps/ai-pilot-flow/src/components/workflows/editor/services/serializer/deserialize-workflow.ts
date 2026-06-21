import { createWorkflowNode } from "@/components/workflows/editor/nodes/registry/workflow-node-factory"
import {
  getWorkflowNodeDefinition,
  type WorkflowCanvasNode,
  type WorkflowNodeType,
} from "@/components/workflows/editor/nodes/registry/workflow-node-registry"
import {
  MAX_SCALE,
  MIN_SCALE,
  clamp,
  normalizeScale,
  type ViewportState,
} from "@/components/workflows/editor/interactions/utils/viewport"
import {
  WORKFLOW_DOCUMENT_VERSION,
  type SerializedWorkflowDocument,
} from "@/components/workflows/editor/services/serializer/serialize-workflow"

export type DeserializedWorkflow = {
  nodes: WorkflowCanvasNode[]
  viewport: ViewportState
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function isWorkflowNodeType(value: unknown): value is WorkflowNodeType {
  return value === "prompt" || value === "file" || value === "export"
}

function parseViewport(value: unknown): ViewportState {
  if (!isRecord(value)) {
    return { x: 0, y: 0, scale: 1 }
  }

  const x =
    typeof value.x === "number" && Number.isFinite(value.x) ? value.x : 0
  const y =
    typeof value.y === "number" && Number.isFinite(value.y) ? value.y : 0
  const scale =
    typeof value.scale === "number" && Number.isFinite(value.scale)
      ? normalizeScale(clamp(value.scale, MIN_SCALE, MAX_SCALE))
      : 1

  return { x, y, scale }
}

function parseNode(value: unknown, index: number): WorkflowCanvasNode | null {
  if (!isRecord(value) || !isWorkflowNodeType(value.type)) {
    return null
  }

  const id =
    typeof value.id === "string" && value.id.trim().length > 0
      ? value.id
      : `${value.type}-${index + 1}`
  const x =
    typeof value.x === "number" && Number.isFinite(value.x) ? value.x : 0
  const y =
    typeof value.y === "number" && Number.isFinite(value.y) ? value.y : 0
  const definition = getWorkflowNodeDefinition(value.type)
  const defaultNode = createWorkflowNode({
    id,
    type: value.type,
    x,
    y,
  })

  return {
    ...defaultNode,
    data: {
      ...definition.createData(),
      ...(isRecord(value.data) ? value.data : {}),
    },
  }
}

export function deserializeWorkflow(
  input: string | SerializedWorkflowDocument
): DeserializedWorkflow {
  const parsedInput =
    typeof input === "string" ? (JSON.parse(input) as unknown) : input

  if (!isRecord(parsedInput)) {
    return {
      nodes: [],
      viewport: { x: 0, y: 0, scale: 1 },
    }
  }

  const rawNodes = Array.isArray(parsedInput.nodes) ? parsedInput.nodes : []
  const uniqueNodeIds = new Set<string>()
  const nodes = rawNodes.flatMap((node, index) => {
    const parsedNode = parseNode(node, index)
    if (!parsedNode || uniqueNodeIds.has(parsedNode.id)) {
      return []
    }

    uniqueNodeIds.add(parsedNode.id)
    return [parsedNode]
  })

  return {
    nodes,
    viewport: parseViewport(parsedInput.viewport),
  }
}

export function isSerializedWorkflowDocument(value: unknown) {
  return (
    isRecord(value) &&
    value.version === WORKFLOW_DOCUMENT_VERSION &&
    Array.isArray(value.nodes) &&
    isRecord(value.viewport)
  )
}
