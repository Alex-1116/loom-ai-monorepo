import type { WorkflowPortRef } from "@/components/workflows/editor/model/types/workflow-edge"

export type WorkflowNodeType =
  | "prompt"
  | "file"
  | "preview"
  | "export"
  | "import-lora"
  | "import-multiple-loras"
  | "image-model"
  | "video-model"
  | "3d-model"

export type WorkflowNodePortData = {
  key: string
  label: string
  side: WorkflowPortRef["side"]
  labelVisibility?: "always" | "hover"
  portToneClassName?: string
  labelToneClassName?: string
}

export type WorkflowNodeData = {
  title?: string
  content?: string
  inputLabel?: string
  outputLabel?: string
  secondaryOutputLabel?: string
  actionLabel?: string
  modelKey?: string
  inputPorts?: WorkflowNodePortData[]
  outputPorts?: WorkflowNodePortData[]
  addInputLabel?: string
  runLabel?: string
  showAddInputAction?: boolean
  showRunAction?: boolean
}

export type WorkflowCanvasNode = {
  id: string
  type: WorkflowNodeType
  x: number
  y: number
  data?: WorkflowNodeData
}
