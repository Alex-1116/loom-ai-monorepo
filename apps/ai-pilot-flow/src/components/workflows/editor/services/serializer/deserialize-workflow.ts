import { createWorkflowNode } from "@/components/workflows/editor/nodes/registry/workflow-node-factory"
import { getWorkflowNodeDefinition } from "@/components/workflows/editor/nodes/registry/workflow-node-registry"
import {
  MAX_SCALE,
  MIN_SCALE,
  clamp,
  normalizeScale,
} from "@/components/workflows/editor/interactions/utils/viewport"
import type {
  WorkflowEdge,
  WorkflowPortRef,
} from "@/components/workflows/editor/model/types/workflow-edge"
import type {
  WorkflowCanvasNode,
  WorkflowNodeType,
} from "@/components/workflows/editor/model/types/workflow-node"
import type { ViewportState } from "@/components/workflows/editor/model/types/viewport"
import {
  WORKFLOW_DOCUMENT_VERSION,
  type SerializedWorkflowDocument,
} from "@/components/workflows/editor/services/serializer/serialize-workflow"

export type DeserializedWorkflow = {
  nodes: WorkflowCanvasNode[]
  edges: WorkflowEdge[]
  viewport: ViewportState
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function isWorkflowNodeType(value: unknown): value is WorkflowNodeType {
  return (
    value === "image-model" ||
    value === "video-model" ||
    value === "3d-model" ||
    value === "tool" ||
    value === "preview" ||
    value === "export" ||
    value === "import-lora" ||
    value === "import-multiple-loras"
  )
}

function isWorkflowPortSide(value: unknown): value is WorkflowPortRef["side"] {
  return value === "left" || value === "right"
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

function parsePortRef(value: unknown): WorkflowPortRef | null {
  if (
    !isRecord(value) ||
    typeof value.nodeId !== "string" ||
    !isWorkflowPortSide(value.side)
  ) {
    return null
  }

  return {
    nodeId: value.nodeId,
    side: value.side,
    key:
      typeof value.key === "string" && value.key.trim().length > 0
        ? value.key
        : undefined,
  }
}

function parseEdge(value: unknown, index: number): WorkflowEdge | null {
  if (!isRecord(value)) {
    return null
  }

  const source = parsePortRef(value.source)
  const target = parsePortRef(value.target)
  if (!source || !target) {
    return null
  }

  return {
    id:
      typeof value.id === "string" && value.id.trim().length > 0
        ? value.id
        : `edge-${index + 1}`,
    source,
    target,
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
      edges: [],
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
  const validNodeIds = new Set(nodes.map((node) => node.id))
  const rawEdges = Array.isArray(parsedInput.edges) ? parsedInput.edges : []
  const uniqueEdgeIds = new Set<string>()
  const edges = rawEdges.flatMap((edge, index) => {
    const parsedEdge = parseEdge(edge, index)
    if (!parsedEdge || uniqueEdgeIds.has(parsedEdge.id)) {
      return []
    }

    if (
      !validNodeIds.has(parsedEdge.source.nodeId) ||
      !validNodeIds.has(parsedEdge.target.nodeId)
    ) {
      return []
    }

    uniqueEdgeIds.add(parsedEdge.id)
    return [parsedEdge]
  })

  return {
    nodes,
    edges,
    viewport: parseViewport(parsedInput.viewport),
  }
}

export function isSerializedWorkflowDocument(value: unknown) {
  return (
    isRecord(value) &&
    value.version === WORKFLOW_DOCUMENT_VERSION &&
    Array.isArray(value.nodes) &&
    Array.isArray(value.edges) &&
    isRecord(value.viewport)
  )
}
