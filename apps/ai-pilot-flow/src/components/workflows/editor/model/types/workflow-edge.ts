export type WorkflowPortSide = "left" | "right"

export type WorkflowPortRef = {
  nodeId: string
  side: WorkflowPortSide
  key?: string
}

export type WorkflowEdge = {
  id: string
  source: WorkflowPortRef
  target: WorkflowPortRef
}
