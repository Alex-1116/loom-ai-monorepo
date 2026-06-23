export type SharedWorkflowPortSide = "left" | "right"

export type SharedWorkflowPortRef = {
  nodeId: string
  side: SharedWorkflowPortSide
  key?: string
}

export type SharedWorkflowNodeType =
  | "prompt"
  | "file"
  | "preview"
  | "export"
  | "import-lora"
  | "import-multiple-loras"
  | "image-model"
  | "video-model"
  | "3d-model"
  | "tool"

export type SharedWorkflowNodePortData = {
  key: string
  label: string
  side: SharedWorkflowPortSide
  labelVisibility?: "always" | "hover"
  portToneClassName?: string
  labelToneClassName?: string
}

export type SharedWorkflowNodeData = {
  title?: string
  content?: string
  inputLabel?: string
  outputLabel?: string
  secondaryOutputLabel?: string
  actionLabel?: string
  modelKey?: string
  toolKey?: string
  toolCategory?: string
  inputPorts?: SharedWorkflowNodePortData[]
  outputPorts?: SharedWorkflowNodePortData[]
  addInputLabel?: string
  runLabel?: string
  showAddInputAction?: boolean
  showRunAction?: boolean
}

export type SharedWorkflowNode = {
  id: string
  type: SharedWorkflowNodeType
  x: number
  y: number
  data?: SharedWorkflowNodeData
}

export type SharedWorkflowEdge = {
  id: string
  source: SharedWorkflowPortRef
  target: SharedWorkflowPortRef
}

export type SharedWorkflowGraph = {
  nodes: SharedWorkflowNode[]
  edges: SharedWorkflowEdge[]
}

export type WorkflowRuntimeValue = unknown

export type WorkflowExecutionStatus =
  | "idle"
  | "pending"
  | "running"
  | "succeeded"
  | "failed"

export type WorkflowRuntimeVariables = Record<string, WorkflowRuntimeValue>

export type WorkflowRuntimePortOutputs = Record<string, WorkflowRuntimeValue>

export type WorkflowRuntimeNodeOutput = {
  default?: WorkflowRuntimeValue
  ports?: WorkflowRuntimePortOutputs
}

export type WorkflowRuntimeOutputs = Record<string, WorkflowRuntimeNodeOutput>

export type WorkflowNodeExecutionState = {
  nodeId: string
  status: WorkflowExecutionStatus
  output?: WorkflowRuntimeNodeOutput
  error?: string
}

export type WorkflowRunResult = {
  status: WorkflowExecutionStatus
  order: string[]
  nodeStates: WorkflowNodeExecutionState[]
  outputs: WorkflowRuntimeOutputs
}
