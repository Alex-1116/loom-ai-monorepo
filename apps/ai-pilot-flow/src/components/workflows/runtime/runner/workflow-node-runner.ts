import {
  getExportDefinition,
  getExportRuntimeInputPorts,
  normalizeExportRuntimeResult,
} from "@/components/workflows/editor/model/constants/export-definitions"
import {
  getFileDefinition,
  getFileRuntimeOutputPorts,
  normalizeFileRuntimeResult,
} from "@/components/workflows/editor/model/constants/file-definitions"
import {
  getImportLoraDefinition,
  getImportLoraRuntimeOutputPorts,
  normalizeImportLoraRuntimeResult,
} from "@/components/workflows/editor/model/constants/import-lora-definitions"
import {
  getImportMultipleLorasDefinition,
  getImportMultipleLorasRuntimeOutputPorts,
  normalizeImportMultipleLorasRuntimeResult,
} from "@/components/workflows/editor/model/constants/import-multiple-loras-definitions"
import {
  getPromptDefinition,
  getPromptRuntimeOutputPorts,
  normalizePromptRuntimeResult,
} from "@/components/workflows/editor/model/constants/prompt-definitions"
import {
  getPreviewDefinition,
  getPreviewRuntimeInputPorts,
  normalizePreviewRuntimeResult,
} from "@/components/workflows/editor/model/constants/preview-definitions"
import {
  getToolDefinition,
  getToolRuntimeOutputPorts,
  normalizeToolRuntimeResult,
} from "@/components/workflows/editor/model/constants/tool-definitions"
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

function createBuiltInWorkflowNodeHandlers(): Record<
  SharedWorkflowNodeType,
  WorkflowNodeHandler
> {
  return {
    prompt({ node, graph, context }) {
      const outputPorts = getPromptRuntimeOutputPorts(node)
      const definition = getPromptDefinition()
      const result = definition.runtime?.run({
        node,
        graph,
        context,
        outputPorts,
      })

      return normalizePromptRuntimeResult(result, {
        node,
        graph,
        context,
        outputPorts,
      })
    },
    file({ node, graph, context }) {
      const outputPorts = getFileRuntimeOutputPorts(node)
      const definition = getFileDefinition()
      const result = definition.runtime?.run({
        node,
        graph,
        context,
        outputPorts,
      })

      return normalizeFileRuntimeResult(result, {
        node,
        graph,
        context,
        outputPorts,
      })
    },
    export({ node, graph, context }) {
      const inputPorts = getExportRuntimeInputPorts(node)
      const inputs = getWorkflowNodeInputs(node, graph, context)
      const definition = getExportDefinition()
      const result = definition.runtime?.run({
        node,
        graph,
        context,
        inputPorts,
        inputs,
      })

      return normalizeExportRuntimeResult(result, {
        node,
        graph,
        context,
        inputPorts,
        inputs,
      })
    },
    preview({ node, graph, context }) {
      const inputPorts = getPreviewRuntimeInputPorts(node)
      const inputs = getWorkflowNodeInputs(node, graph, context)
      const definition = getPreviewDefinition()
      const result = definition.runtime?.run({
        node,
        graph,
        context,
        inputPorts,
        inputs,
      })

      return normalizePreviewRuntimeResult(result, {
        node,
        graph,
        context,
        inputPorts,
        inputs,
      })
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
      const outputPorts = getToolRuntimeOutputPorts(node)
      const definition = getToolDefinition(node.data?.toolKey)
      const result = definition?.runtime?.run({
        node,
        graph,
        context,
        inputs,
        outputPorts,
      })

      return definition
        ? normalizeToolRuntimeResult(
            result,
            {
              node,
              graph,
              context,
              inputs,
              outputPorts,
            },
            definition
          )
        : {
            output: node.data ?? null,
          }
    },
    "import-lora"({ node, graph, context }) {
      const outputPorts = getImportLoraRuntimeOutputPorts(node)
      const definition = getImportLoraDefinition()
      const result = definition.runtime?.run({
        node,
        graph,
        context,
        outputPorts,
      })

      return normalizeImportLoraRuntimeResult(result, {
        node,
        graph,
        context,
        outputPorts,
      })
    },
    "import-multiple-loras"({ node, graph, context }) {
      const outputPorts = getImportMultipleLorasRuntimeOutputPorts(node)
      const definition = getImportMultipleLorasDefinition()
      const result = definition.runtime?.run({
        node,
        graph,
        context,
        outputPorts,
      })

      return normalizeImportMultipleLorasRuntimeResult(result, {
        node,
        graph,
        context,
        outputPorts,
      })
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
