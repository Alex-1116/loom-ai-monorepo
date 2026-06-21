"use client"

import {
  getWorkflowNodeSpec,
  workflowSchema,
} from "@/components/workflows/editor/model/schema/workflow-schema"
import type {
  WorkflowNodePortSchema,
  WorkflowNodeSchema,
} from "@/components/workflows/editor/model/schema/node-schema"
import type {
  WorkflowNodeData,
  WorkflowNodeType,
} from "@/components/workflows/editor/model/types/workflow-node"

export type {
  WorkflowCanvasNode,
  WorkflowNodeData,
  WorkflowNodeType,
} from "@/components/workflows/editor/model/types/workflow-node"

export type WorkflowNodeDefinition = {
  type: WorkflowNodeType
  menuLabel: string
  createData: () => WorkflowNodeData
  schema: WorkflowNodeSchema
  ports: WorkflowNodePortSchema[]
}

const workflowNodeDefinitions: readonly WorkflowNodeDefinition[] =
  workflowSchema.nodes.map(({ config, schema }) => ({
    type: config.type,
    menuLabel: config.menuLabel,
    createData: () => ({
      ...config.defaults,
    }),
    schema,
    ports: config.ports ?? [],
  }))

const workflowNodeRegistry = new Map<WorkflowNodeType, WorkflowNodeDefinition>(
  workflowNodeDefinitions.map((definition) => [definition.type, definition])
)

export const workflowNodeMenuItems = workflowNodeDefinitions.map(
  (definition) => ({
    type: definition.type,
    label: definition.menuLabel,
  })
)

export function getWorkflowNodeDefinition(type: WorkflowNodeType) {
  const definition = workflowNodeRegistry.get(type)
  if (definition) {
    return definition
  }

  const { config, schema } = getWorkflowNodeSpec(type)
  return {
    type: config.type,
    menuLabel: config.menuLabel,
    createData: () => ({
      ...config.defaults,
    }),
    schema,
    ports: config.ports ?? [],
  }
}

export function getWorkflowNodePort(
  type: WorkflowNodeType,
  portKey: string
): WorkflowNodePortSchema | undefined {
  return getWorkflowNodeDefinition(type).ports.find(
    (port) => port.key === portKey
  )
}

export function getRequiredWorkflowNodePort(
  type: WorkflowNodeType,
  portKey: string
): WorkflowNodePortSchema {
  const port = getWorkflowNodePort(type, portKey)
  if (port) {
    return port
  }

  throw new Error(`Missing required workflow node port: ${type}.${portKey}`)
}
