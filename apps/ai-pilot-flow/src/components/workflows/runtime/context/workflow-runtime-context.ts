import type {
  WorkflowRuntimeOutputs,
  WorkflowRuntimeValue,
  WorkflowRuntimeVariables,
} from "@/components/workflows/shared/types/workflow-runtime"

export type WorkflowRuntimeContext = {
  variables: WorkflowRuntimeVariables
  outputs: WorkflowRuntimeOutputs
}

export function createWorkflowRuntimeContext(
  initialContext: Partial<WorkflowRuntimeContext> = {}
): WorkflowRuntimeContext {
  return {
    variables: initialContext.variables ?? {},
    outputs: initialContext.outputs ?? {},
  }
}

export function getWorkflowRuntimeOutput(
  context: WorkflowRuntimeContext,
  nodeId: string
) {
  return context.outputs[nodeId]
}

export function setWorkflowRuntimeOutput(
  context: WorkflowRuntimeContext,
  nodeId: string,
  output: WorkflowRuntimeValue
): WorkflowRuntimeContext {
  return {
    ...context,
    outputs: {
      ...context.outputs,
      [nodeId]: output,
    },
  }
}
