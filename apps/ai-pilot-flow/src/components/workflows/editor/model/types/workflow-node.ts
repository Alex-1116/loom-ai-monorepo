export type WorkflowNodeType =
  | "prompt"
  | "file"
  | "preview"
  | "export"
  | "import-lora"
  | "import-multiple-loras"

export type WorkflowNodeData = {
  title?: string
  content?: string
  inputLabel?: string
  outputLabel?: string
  secondaryOutputLabel?: string
  actionLabel?: string
}

export type WorkflowCanvasNode = {
  id: string
  type: WorkflowNodeType
  x: number
  y: number
  data?: WorkflowNodeData
}
