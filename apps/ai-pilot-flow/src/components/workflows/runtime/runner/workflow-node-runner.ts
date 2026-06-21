import type { WorkflowRuntimeContext } from "@/components/workflows/runtime/context/workflow-runtime-context"
import type {
  SharedWorkflowGraph,
  SharedWorkflowNode,
  SharedWorkflowNodeType,
  WorkflowRuntimeValue,
} from "@/components/workflows/shared/types/workflow-runtime"

export type WorkflowNodeRunInput = {
  node: SharedWorkflowNode
  graph: SharedWorkflowGraph
  context: WorkflowRuntimeContext
}

export type WorkflowNodeRunResult = {
  output?: WorkflowRuntimeValue
}

export type WorkflowNodeHandler = (
  input: WorkflowNodeRunInput
) => Promise<WorkflowNodeRunResult> | WorkflowNodeRunResult

export type WorkflowNodeRunner = {
  runNode: (
    input: WorkflowNodeRunInput
  ) => Promise<WorkflowNodeRunResult> | WorkflowNodeRunResult
}

type WorkflowNodeInputs = {
  upstreamNodeIds: string[]
  upstreamOutputs: WorkflowRuntimeValue[]
}

function getWorkflowNodeInputs(
  node: SharedWorkflowNode,
  graph: SharedWorkflowGraph,
  context: WorkflowRuntimeContext
): WorkflowNodeInputs {
  const upstreamNodeIds = Array.from(
    new Set(
      graph.edges
        .filter((edge) => edge.target.nodeId === node.id)
        .map((edge) => edge.source.nodeId)
    )
  )

  return {
    upstreamNodeIds,
    upstreamOutputs: upstreamNodeIds
      .map((nodeId) => context.outputs[nodeId])
      .filter((output) => output !== undefined),
  }
}

function createBuiltInWorkflowNodeHandlers(): Record<
  SharedWorkflowNodeType,
  WorkflowNodeHandler
> {
  return {
    prompt({ node, graph, context }) {
      const inputs = getWorkflowNodeInputs(node, graph, context)

      return {
        output: {
          kind: "prompt",
          nodeId: node.id,
          title: node.data?.title ?? "Prompt",
          content: node.data?.content ?? "",
          inputCount: inputs.upstreamOutputs.length,
          inputs: inputs.upstreamOutputs,
        },
      }
    },
    file({ node }) {
      return {
        output: {
          kind: "file",
          nodeId: node.id,
          title: node.data?.title ?? "File",
          files: [
            {
              name: `${node.id}.mock`,
              source: "mock-runtime",
            },
          ],
        },
      }
    },
    "import-lora"({ node }) {
      return {
        output: {
          kind: "import-lora",
          nodeId: node.id,
          title: node.data?.title ?? "Import LoRA",
          outputLabel: node.data?.outputLabel ?? "LoRA URL",
          url: `mock://lora/${node.id}`,
          files: [
            {
              name: `${node.id}.safetensors`,
              source: "mock-runtime",
            },
          ],
        },
      }
    },
    preview({ node, graph, context }) {
      const inputs = getWorkflowNodeInputs(node, graph, context)

      return {
        output: {
          kind: "preview",
          nodeId: node.id,
          title: node.data?.title ?? "Preview",
          inputLabel: node.data?.inputLabel ?? "File",
          source:
            inputs.upstreamOutputs.length === 1
              ? inputs.upstreamOutputs[0]
              : inputs.upstreamOutputs,
        },
      }
    },
    export({ node, graph, context }) {
      const inputs = getWorkflowNodeInputs(node, graph, context)

      return {
        output: {
          kind: "export",
          nodeId: node.id,
          title: node.data?.title ?? "Export",
          actionLabel: node.data?.actionLabel ?? "Export",
          inputs: inputs.upstreamOutputs,
          result:
            inputs.upstreamOutputs.length === 1
              ? inputs.upstreamOutputs[0]
              : inputs.upstreamOutputs,
        },
      }
    },
  }
}

export function createWorkflowNodeRunner(
  handlers: Partial<Record<SharedWorkflowNodeType, WorkflowNodeHandler>> = {}
): WorkflowNodeRunner {
  const builtInHandlers = createBuiltInWorkflowNodeHandlers()

  return {
    async runNode(input) {
      const handler =
        handlers[input.node.type] ?? builtInHandlers[input.node.type]

      if (!handler) {
        return {
          output: input.node.data ?? null,
        }
      }

      return handler(input)
    },
  }
}
