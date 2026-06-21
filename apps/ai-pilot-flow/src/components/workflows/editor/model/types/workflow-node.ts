export type WorkflowNodeType =
  | "prompt"
  | "file"
  | "preview"
  | "export"
  | "import-lora"

export type WorkflowNodeData = {
  title?: string
  content?: string
  inputLabel?: string
  outputLabel?: string
  actionLabel?: string
}

export type WorkflowCanvasNode = {
  id: string
  type: WorkflowNodeType
  x: number
  y: number
  data?: WorkflowNodeData
}
