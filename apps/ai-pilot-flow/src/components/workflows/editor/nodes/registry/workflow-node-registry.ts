"use client"

export type WorkflowNodeType = "prompt" | "file" | "export"

export type WorkflowNodeData = {
  title?: string
  content?: string
  inputLabel?: string
  actionLabel?: string
}

export type WorkflowCanvasNode = {
  id: string
  type: WorkflowNodeType
  x: number
  y: number
  data?: WorkflowNodeData
}

export type WorkflowNodeDefinition = {
  type: WorkflowNodeType
  menuLabel: string
  createData: () => WorkflowNodeData
}

// registry 只描述系统里“有哪些节点”和“每种节点的默认数据是什么”。
const workflowNodeDefinitions: readonly WorkflowNodeDefinition[] = [
  {
    type: "prompt",
    menuLabel: "Prompt",
    createData: () => ({
      title: "Prompt",
    }),
  },
  {
    type: "file",
    menuLabel: "Import",
    createData: () => ({
      title: "File",
    }),
  },
  {
    type: "export",
    menuLabel: "Export",
    createData: () => ({
      title: "Export",
      inputLabel: "Input",
      actionLabel: "Export",
    }),
  },
]

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

  if (!definition) {
    throw new Error(`Unknown workflow node type: ${type}`)
  }

  return definition
}
