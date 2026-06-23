"use client"

import { getWorkflowNodeDefinition } from "@/components/workflows/editor/nodes/registry/workflow-node-registry"
import type {
  WorkflowCanvasNode,
  WorkflowNodeData,
  WorkflowNodeType,
} from "@/components/workflows/editor/model/types/workflow-node"

type CreateWorkflowNodeParams = {
  type: WorkflowNodeType
  x: number
  y: number
  id?: string
  data?: Partial<WorkflowNodeData>
}

function createWorkflowNodeId(type: WorkflowNodeType) {
  return `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function createWorkflowNode({
  type,
  x,
  y,
  id,
  data,
}: CreateWorkflowNodeParams): WorkflowCanvasNode {
  const definition = getWorkflowNodeDefinition(type)

  // factory 负责把 registry 的定义实例化成真正可落到画布上的节点对象。
  return {
    id: id ?? createWorkflowNodeId(type),
    type,
    x,
    y,
    data: {
      ...definition.createData(),
      ...data,
    },
  }
}

export function createInitialWorkflowNodes() {
  return [] satisfies WorkflowCanvasNode[]
}
