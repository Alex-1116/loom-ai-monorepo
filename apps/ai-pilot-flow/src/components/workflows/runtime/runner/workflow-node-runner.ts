import {
  getThreeDModelDefinition,
  getThreeDModelRuntimeOutputPorts,
  normalizeThreeDModelRuntimeResult,
} from "@/components/workflows/editor/model/constants/3d-model-definitions"
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
  getImageModelDefinition,
  getImageModelRuntimeOutputPorts,
  normalizeImageModelRuntimeResult,
} from "@/components/workflows/editor/model/constants/image-model-definitions"
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
  getPreviewDefinition,
  getPreviewRuntimeInputPorts,
  normalizePreviewRuntimeResult,
} from "@/components/workflows/editor/model/constants/preview-definitions"
import {
  getToolDefinition,
  getToolRuntimeOutputPorts,
  normalizeToolRuntimeResult,
} from "@/components/workflows/editor/model/constants/tool-definitions"
import {
  getVideoModelDefinition,
  getVideoModelRuntimeOutputPorts,
  normalizeVideoModelRuntimeResult,
} from "@/components/workflows/editor/model/constants/video-model-definitions"
import type { WorkflowRuntimeContext } from "@/components/workflows/runtime/context/workflow-runtime-context"
import { getWorkflowRuntimeOutput } from "@/components/workflows/runtime/context/workflow-runtime-context"
import type {
  SharedWorkflowGraph,
  SharedWorkflowNode,
  SharedWorkflowNodeType,
  WorkflowRuntimeNodeOutput,
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

function createBuiltInWorkflowNodeHandlers(): Record<
  SharedWorkflowNodeType,
  WorkflowNodeHandler
> {
  return {
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
      const outputPorts = getImageModelRuntimeOutputPorts(node)
      const definition = getImageModelDefinition(node.data?.modelKey)
      const result = definition?.runtime?.run({
        node,
        graph,
        context,
        inputs,
        outputPorts,
      })

      return definition
        ? normalizeImageModelRuntimeResult(result, {
            node,
            graph,
            context,
            inputs,
            outputPorts,
          })
        : {
            output: node.data ?? null,
          }
    },
    "video-model"({ node, graph, context }) {
      const inputs = getWorkflowNodeInputs(node, graph, context)
      const outputPorts = getVideoModelRuntimeOutputPorts(node)
      const definition = getVideoModelDefinition(node.data?.modelKey)
      const result = definition?.runtime?.run({
        node,
        graph,
        context,
        inputs,
        outputPorts,
      })

      return definition
        ? normalizeVideoModelRuntimeResult(result, {
            node,
            graph,
            context,
            inputs,
            outputPorts,
          })
        : {
            output: node.data ?? null,
          }
    },
    "3d-model"({ node, graph, context }) {
      const inputs = getWorkflowNodeInputs(node, graph, context)
      const outputPorts = getThreeDModelRuntimeOutputPorts(node)
      const definition = getThreeDModelDefinition(node.data?.modelKey)
      const result = definition?.runtime?.run({
        node,
        graph,
        context,
        inputs,
        outputPorts,
      })

      return definition
        ? normalizeThreeDModelRuntimeResult(result, {
            node,
            graph,
            context,
            inputs,
            outputPorts,
          })
        : {
            output: node.data ?? null,
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
