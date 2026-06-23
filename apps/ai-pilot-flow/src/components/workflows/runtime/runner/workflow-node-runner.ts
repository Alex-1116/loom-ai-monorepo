import type { WorkflowRuntimeContext } from "@/components/workflows/runtime/context/workflow-runtime-context"
import { getWorkflowRuntimeOutput } from "@/components/workflows/runtime/context/workflow-runtime-context"
import type {
  SharedWorkflowGraph,
  SharedWorkflowNode,
  SharedWorkflowNodeType,
  WorkflowRuntimeNodeOutput,
  WorkflowRuntimePortOutputs,
  WorkflowRuntimeValue,
} from "@/components/workflows/shared/types/workflow-runtime"

export type WorkflowNodeRunInput = {
  node: SharedWorkflowNode
  graph: SharedWorkflowGraph
  context: WorkflowRuntimeContext
}

export type WorkflowNodeRunResult = {
  output?: WorkflowRuntimeValue
  outputs?: WorkflowRuntimeNodeOutput
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
  inputsByTargetPort: Record<string, WorkflowRuntimeValue[]>
  connections: Array<{
    edgeId: string
    sourceNodeId: string
    sourcePortKey?: string
    targetPortKey?: string
    value: WorkflowRuntimeValue
  }>
}

function getWorkflowNodeInputs(
  node: SharedWorkflowNode,
  graph: SharedWorkflowGraph,
  context: WorkflowRuntimeContext
): WorkflowNodeInputs {
  const connections = graph.edges.flatMap((edge) => {
    if (edge.target.nodeId !== node.id) {
      return []
    }

    const value = getWorkflowRuntimeOutput(
      context,
      edge.source.nodeId,
      edge.source.key
    )
    if (value === undefined) {
      return []
    }

    return [
      {
        edgeId: edge.id,
        sourceNodeId: edge.source.nodeId,
        sourcePortKey: edge.source.key,
        targetPortKey: edge.target.key,
        value,
      },
    ]
  })

  const upstreamNodeIds = Array.from(
    new Set(connections.map((connection) => connection.sourceNodeId))
  )
  const inputsByTargetPort = connections.reduce<
    Record<string, WorkflowRuntimeValue[]>
  >((result, connection) => {
    if (!connection.targetPortKey) {
      return result
    }

    const existingValues = result[connection.targetPortKey] ?? []
    result[connection.targetPortKey] = [...existingValues, connection.value]
    return result
  }, {})

  return {
    upstreamNodeIds,
    upstreamOutputs: connections.map((connection) => connection.value),
    inputsByTargetPort,
    connections,
  }
}

function createWorkflowNodeOutput(
  defaultOutput?: WorkflowRuntimeValue,
  portOutputs?: WorkflowRuntimePortOutputs
): WorkflowRuntimeNodeOutput {
  return {
    default: defaultOutput,
    ports:
      portOutputs && Object.keys(portOutputs).length > 0
        ? portOutputs
        : undefined,
  }
}

function getGeneratedModelOutputPorts(node: SharedWorkflowNode) {
  const outputPorts = node.data?.outputPorts?.filter(
    (port) => port.side === "right"
  )

  return outputPorts && outputPorts.length > 0
    ? outputPorts
    : [
        {
          key: "result",
          label: "Result",
          side: "right" as const,
        },
      ]
}

function getGeneratedToolOutputPorts(node: SharedWorkflowNode) {
  const outputPorts = node.data?.outputPorts?.filter(
    (port) => port.side === "right"
  )

  return outputPorts && outputPorts.length > 0
    ? outputPorts
    : [
        {
          key: "result",
          label: "Result",
          side: "right" as const,
        },
      ]
}

function createBuiltInWorkflowNodeHandlers(): Record<
  SharedWorkflowNodeType,
  WorkflowNodeHandler
> {
  return {
    prompt({ node, graph, context }) {
      const inputs = getWorkflowNodeInputs(node, graph, context)
      const output = {
        kind: "prompt",
        nodeId: node.id,
        title: node.data?.title ?? "Prompt",
        content: node.data?.content ?? "",
        inputCount: inputs.upstreamOutputs.length,
        inputs: inputs.upstreamOutputs,
      }

      return {
        output,
        outputs: createWorkflowNodeOutput(output, {
          output,
        }),
      }
    },
    file({ node }) {
      const output = {
        kind: "file",
        nodeId: node.id,
        title: node.data?.title ?? "File",
        files: [
          {
            name: `${node.id}.mock`,
            source: "mock-runtime",
          },
        ],
      }

      return {
        output,
        outputs: createWorkflowNodeOutput(output, {
          output,
        }),
      }
    },
    "image-model"({ node, graph, context }) {
      const inputs = getWorkflowNodeInputs(node, graph, context)
      const outputPorts = getGeneratedModelOutputPorts(node)
      const output = {
        kind: "image-model",
        nodeId: node.id,
        title: node.data?.title ?? "Image Model",
        modelKey: node.data?.modelKey ?? "image-model",
        inputs: inputs.inputsByTargetPort,
        connections: inputs.connections,
        result: `mock://image-model/${node.id}`,
      }
      const portOutputs = outputPorts.reduce<WorkflowRuntimePortOutputs>(
        (result, port) => {
          result[port.key] = {
            kind: "image-model-result",
            nodeId: node.id,
            modelKey: node.data?.modelKey ?? "image-model",
            portKey: port.key,
            value: output.result,
            inputs: inputs.inputsByTargetPort,
          }
          return result
        },
        {}
      )

      return {
        output,
        outputs: createWorkflowNodeOutput(output, portOutputs),
      }
    },
    "video-model"({ node, graph, context }) {
      const inputs = getWorkflowNodeInputs(node, graph, context)
      const outputPorts = getGeneratedModelOutputPorts(node)
      const output = {
        kind: "video-model",
        nodeId: node.id,
        title: node.data?.title ?? "Video Model",
        modelKey: node.data?.modelKey ?? "video-model",
        inputs: inputs.inputsByTargetPort,
        connections: inputs.connections,
        result: `mock://video-model/${node.id}`,
      }
      const portOutputs = outputPorts.reduce<WorkflowRuntimePortOutputs>(
        (result, port) => {
          result[port.key] = {
            kind: "video-model-result",
            nodeId: node.id,
            modelKey: node.data?.modelKey ?? "video-model",
            portKey: port.key,
            value: output.result,
            inputs: inputs.inputsByTargetPort,
          }
          return result
        },
        {}
      )

      return {
        output,
        outputs: createWorkflowNodeOutput(output, portOutputs),
      }
    },
    "3d-model"({ node, graph, context }) {
      const inputs = getWorkflowNodeInputs(node, graph, context)
      const outputPorts = getGeneratedModelOutputPorts(node)
      const output = {
        kind: "3d-model",
        nodeId: node.id,
        title: node.data?.title ?? "3D Model",
        modelKey: node.data?.modelKey ?? "3d-model",
        inputs: inputs.inputsByTargetPort,
        connections: inputs.connections,
        result: `mock://3d-model/${node.id}`,
      }
      const portOutputs = outputPorts.reduce<WorkflowRuntimePortOutputs>(
        (result, port) => {
          result[port.key] = {
            kind: "3d-model-result",
            nodeId: node.id,
            modelKey: node.data?.modelKey ?? "3d-model",
            portKey: port.key,
            value: output.result,
            inputs: inputs.inputsByTargetPort,
          }
          return result
        },
        {}
      )

      return {
        output,
        outputs: createWorkflowNodeOutput(output, portOutputs),
      }
    },
    tool({ node, graph, context }) {
      const inputs = getWorkflowNodeInputs(node, graph, context)
      const outputPorts = getGeneratedToolOutputPorts(node)
      const toolKey = node.data?.toolKey ?? "tool"
      const toolCategory = node.data?.toolCategory ?? "Tool"
      const output = {
        kind: "tool",
        nodeId: node.id,
        title: node.data?.title ?? "Tool",
        toolKey,
        toolCategory,
        inputs: inputs.inputsByTargetPort,
        connections: inputs.connections,
        result: `mock://tool/${toolKey}/${node.id}`,
      }
      const portOutputs = outputPorts.reduce<WorkflowRuntimePortOutputs>(
        (result, port) => {
          result[port.key] = {
            kind: "tool-result",
            nodeId: node.id,
            toolKey,
            toolCategory,
            portKey: port.key,
            label: port.label,
            value:
              port.key === "result"
                ? output.result
                : `mock://tool/${toolKey}/${node.id}/${port.key}`,
            inputs: inputs.inputsByTargetPort,
          }
          return result
        },
        {}
      )

      return {
        output,
        outputs: createWorkflowNodeOutput(output, portOutputs),
      }
    },
    "import-lora"({ node }) {
      const output = {
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
      }

      return {
        output,
        outputs: createWorkflowNodeOutput(output, {
          output,
        }),
      }
    },
    "import-multiple-loras"({ node }) {
      const loras = [
        {
          url: `mock://loras/${node.id}/default`,
          weight: 0,
        },
      ]
      const output = {
        kind: "import-multiple-loras",
        nodeId: node.id,
        title: node.data?.title ?? "Import Multiple LoRAs",
        outputLabel: node.data?.outputLabel ?? "LoRA URL",
        secondaryOutputLabel: node.data?.secondaryOutputLabel ?? "Weight",
        url: `mock://loras/${node.id}`,
        weight: 0,
        loras,
      }

      return {
        output,
        outputs: createWorkflowNodeOutput(output, {
          "lora-url": {
            kind: "lora-url",
            nodeId: node.id,
            values: loras.map((lora) => lora.url),
            loras,
          },
          weight: {
            kind: "lora-weight",
            nodeId: node.id,
            values: loras.map((lora) => lora.weight),
            weight: 0,
          },
        }),
      }
    },
    preview({ node, graph, context }) {
      const inputs = getWorkflowNodeInputs(node, graph, context)
      const sourceValues =
        inputs.inputsByTargetPort.input ?? inputs.upstreamOutputs
      const output = {
        kind: "preview",
        nodeId: node.id,
        title: node.data?.title ?? "Preview",
        inputLabel: node.data?.inputLabel ?? "File",
        source: sourceValues.length === 1 ? sourceValues[0] : sourceValues,
      }

      return {
        output,
        outputs: createWorkflowNodeOutput(output),
      }
    },
    export({ node, graph, context }) {
      const inputs = getWorkflowNodeInputs(node, graph, context)
      const inputValues =
        inputs.inputsByTargetPort.input ?? inputs.upstreamOutputs
      const output = {
        kind: "export",
        nodeId: node.id,
        title: node.data?.title ?? "Export",
        actionLabel: node.data?.actionLabel ?? "Export",
        inputs: inputValues,
        result: inputValues.length === 1 ? inputValues[0] : inputValues,
      }

      return {
        output,
        outputs: createWorkflowNodeOutput(output),
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
