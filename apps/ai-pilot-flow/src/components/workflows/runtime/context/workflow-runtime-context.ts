import type {
  WorkflowRuntimeNodeOutput,
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
  nodeId: string,
  portKey?: string
) {
  const nodeOutput = context.outputs[nodeId]
  if (!nodeOutput) {
    return undefined
  }

  if (portKey) {
    return nodeOutput.ports?.[portKey]
  }

  return nodeOutput.default
}

export function getWorkflowRuntimeNodeOutput(
  context: WorkflowRuntimeContext,
  nodeId: string
) {
  return context.outputs[nodeId]
}

export function setWorkflowRuntimeNodeOutput(
  context: WorkflowRuntimeContext,
  nodeId: string,
  output: WorkflowRuntimeNodeOutput
): WorkflowRuntimeContext {
  return {
    ...context,
    outputs: {
      ...context.outputs,
      [nodeId]: {
        ...output,
        ports: output.ports ? { ...output.ports } : undefined,
      },
    },
  }
}

export function setWorkflowRuntimeOutput(
  context: WorkflowRuntimeContext,
  nodeId: string,
  output: WorkflowRuntimeValue,
  portKey?: string
): WorkflowRuntimeContext {
  const currentNodeOutput = context.outputs[nodeId]

  return {
    ...context,
    outputs: {
      ...context.outputs,
      [nodeId]: portKey
        ? {
            default: currentNodeOutput?.default,
            ports: {
              ...(currentNodeOutput?.ports ?? {}),
              [portKey]: output,
            },
          }
        : {
            default: output,
            ports: currentNodeOutput?.ports
              ? { ...currentNodeOutput.ports }
              : undefined,
          },
    },
  }
}
