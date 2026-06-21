import type { WorkflowDocument } from "@/components/workflows/editor/model/types/workflow-editor"
import {
  createWorkflowRuntimeContext,
  setWorkflowRuntimeOutput,
  type WorkflowRuntimeContext,
} from "@/components/workflows/runtime/context/workflow-runtime-context"
import {
  createWorkflowNodeRunner,
  type WorkflowNodeRunner,
} from "@/components/workflows/runtime/runner/workflow-node-runner"
import { createWorkflowExecutionPlan } from "@/components/workflows/runtime/scheduler/workflow-scheduler"
import { createSharedWorkflowGraph } from "@/components/workflows/shared/utils/create-shared-workflow-graph"
import type {
  SharedWorkflowGraph,
  WorkflowExecutionStatus,
  WorkflowNodeExecutionState,
  WorkflowRunResult,
} from "@/components/workflows/shared/types/workflow-runtime"

export type WorkflowNodeStateChangeHandler = (
  state: WorkflowNodeExecutionState
) => void

export type RunWorkflowParams = {
  graph: SharedWorkflowGraph
  context?: Partial<WorkflowRuntimeContext>
  runner?: WorkflowNodeRunner
  onNodeStateChange?: WorkflowNodeStateChangeHandler
}

export type RunWorkflowDocumentParams = {
  document: Pick<WorkflowDocument, "nodes" | "edges">
  context?: Partial<WorkflowRuntimeContext>
  runner?: WorkflowNodeRunner
  onNodeStateChange?: WorkflowNodeStateChangeHandler
}

function createWorkflowNodeExecutionState(
  nodeId: string,
  status: WorkflowExecutionStatus,
  state: Partial<WorkflowNodeExecutionState> = {}
): WorkflowNodeExecutionState {
  return {
    nodeId,
    status,
    output: state.output,
    error: state.error,
  }
}

export async function runWorkflow({
  graph,
  context,
  runner = createWorkflowNodeRunner(),
  onNodeStateChange,
}: RunWorkflowParams): Promise<WorkflowRunResult> {
  const executionPlan = createWorkflowExecutionPlan(graph)
  let runtimeContext = createWorkflowRuntimeContext(context)
  const nodeStates: WorkflowNodeExecutionState[] = []

  for (const node of executionPlan.orderedNodes) {
    onNodeStateChange?.(createWorkflowNodeExecutionState(node.id, "running"))

    try {
      const result = await runner.runNode({
        node,
        graph,
        context: runtimeContext,
      })

      if (result.output !== undefined) {
        runtimeContext = setWorkflowRuntimeOutput(
          runtimeContext,
          node.id,
          result.output
        )
      }

      const nodeState = createWorkflowNodeExecutionState(node.id, "succeeded", {
        output: result.output,
      })
      nodeStates.push(nodeState)
      onNodeStateChange?.(nodeState)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown runtime error."

      const nodeState = createWorkflowNodeExecutionState(node.id, "failed", {
        error: message,
      })
      nodeStates.push(nodeState)
      onNodeStateChange?.(nodeState)

      return {
        status: "failed",
        order: executionPlan.orderedNodeIds,
        nodeStates,
        outputs: runtimeContext.outputs,
      }
    }
  }

  return {
    status: "succeeded",
    order: executionPlan.orderedNodeIds,
    nodeStates,
    outputs: runtimeContext.outputs,
  }
}

export function runWorkflowDocument({
  document,
  context,
  runner,
  onNodeStateChange,
}: RunWorkflowDocumentParams) {
  return runWorkflow({
    graph: createSharedWorkflowGraph(document),
    context,
    runner,
    onNodeStateChange,
  })
}
