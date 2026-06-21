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
