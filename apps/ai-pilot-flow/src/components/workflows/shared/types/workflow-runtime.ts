export type SharedWorkflowPortSide = "left" | "right"

export type SharedWorkflowPortRef = {
  nodeId: string
  side: SharedWorkflowPortSide
  key?: string
}

export type SharedWorkflowNodeType = "prompt" | "file" | "preview" | "export"

export type SharedWorkflowNodeData = {
  title?: string
  content?: string
  inputLabel?: string
  actionLabel?: string
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

export type WorkflowRuntimeOutputs = Record<string, WorkflowRuntimeValue>

export type WorkflowNodeExecutionState = {
  nodeId: string
  status: WorkflowExecutionStatus
  output?: WorkflowRuntimeValue
  error?: string
}

export type WorkflowRunResult = {
  status: WorkflowExecutionStatus
  order: string[]
  nodeStates: WorkflowNodeExecutionState[]
  outputs: WorkflowRuntimeOutputs
}
