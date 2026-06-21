import type { WorkflowExecutionStatus } from "@/components/workflows/shared/types/workflow-runtime"

export const WORKFLOW_EXECUTION_STATUSES = [
  "idle",
  "pending",
  "running",
  "succeeded",
  "failed",
] satisfies WorkflowExecutionStatus[]

export const WORKFLOW_RUNTIME_ERROR_CODES = {
  cycleDetected: "workflow.runtime.cycle-detected",
  missingNode: "workflow.runtime.missing-node",
  nodeExecutionFailed: "workflow.runtime.node-execution-failed",
} as const
