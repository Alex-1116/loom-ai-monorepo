import * as React from "react"

import type { WorkflowNodeFieldSchema } from "@/components/workflows/editor/model/schema/node-schema"
import type {
  WorkflowNodeData,
  WorkflowNodePortData,
} from "@/components/workflows/editor/model/types/workflow-node"
import type { WorkflowRuntimeContext } from "@/components/workflows/runtime/context/workflow-runtime-context"
import type {
  SharedWorkflowGraph,
  SharedWorkflowNode,
  SharedWorkflowNodePortData,
  WorkflowExecutionStatus,
  WorkflowRuntimeNodeOutput,
  WorkflowRuntimeValue,
} from "@/components/workflows/shared/types/workflow-runtime"
import { getNodePortOffset } from "@/components/workflows/editor/model/constants/workflow-node-port-offsets"
import { renderFileBody } from "@/components/workflows/editor/nodes/blocks/file/file-shape"

export type FileSchema = {
  fields: WorkflowNodeFieldSchema[]
}

export type FileRendererProps = {
  nodeId: string
  file: FileDefinition
  title?: string
  outputPorts: WorkflowNodePortData[]
  isSelected?: boolean
  executionStatus?: WorkflowExecutionStatus
  isRunning: boolean
}

export type FileRuntimeRunContext = {
  node: SharedWorkflowNode
  graph: SharedWorkflowGraph
  context: WorkflowRuntimeContext
  outputPorts: SharedWorkflowNodePortData[]
}

export type FileRuntimeResult = {
  output?: WorkflowRuntimeValue
  outputs?: WorkflowRuntimeNodeOutput
}

export type FileDefinition = {
  key: string
  label: string
  menu: {
    searchableText?: string
  }
  schema?: FileSchema
  createData: () => WorkflowNodeData
  renderer: {
    width?: string
    renderBody: (props: FileRendererProps) => React.ReactNode
    renderFooter?: (props: FileRendererProps) => React.ReactNode
    getPortOffset?: (index: number) => number
  }
  runtime?: {
    run: (context: FileRuntimeRunContext) => unknown
  }
}

const DEFAULT_FILE_SCHEMA: FileSchema = {
  fields: [
    {
      key: "title",
      label: "Title",
      input: "text",
      placeholder: "Node title",
      rules: [
        {
          kind: "required",
          level: "warning",
          code: "node.file.title.missing",
          message: "File node title is empty.",
        },
      ],
    },
  ],
}

const FILE_OUTPUT_PORT: WorkflowNodePortData = {
  key: "output",
  label: "File",
  side: "right",
  labelVisibility: "hover",
}

function clonePort(port: WorkflowNodePortData): WorkflowNodePortData {
  return { ...port }
}

function createDefaultFileRuntimeResult({
  node,
  outputPorts,
}: {
  node: SharedWorkflowNode
  outputPorts: SharedWorkflowNodePortData[]
}): FileRuntimeResult {
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

  const ports = outputPorts.reduce<Record<string, typeof output>>(
    (result, port) => {
      result[port.key] = output
      return result
    },
    {}
  )

  return {
    output,
    outputs: {
      default: output,
      ports,
    },
  }
}

export const FILE_DEFINITIONS: readonly FileDefinition[] = [
  {
    key: "file",
    label: "File",
    menu: {
      searchableText: "import file upload asset",
    },
    schema: DEFAULT_FILE_SCHEMA,
    createData: () => ({
      title: "File",
      outputPorts: [clonePort(FILE_OUTPUT_PORT)],
      showAddInputAction: false,
      showRunAction: false,
    }),
    renderer: {
      renderBody: renderFileBody,
      getPortOffset: getNodePortOffset,
    },
    runtime: {
      run({ node, outputPorts }) {
        return createDefaultFileRuntimeResult({
          node,
          outputPorts,
        })
      },
    },
  },
] as const

export function getFileDefinition() {
  return FILE_DEFINITIONS[0]!
}

export function getFileSchema() {
  return getFileDefinition()?.schema
}

export function getFilePortOffset(index: number) {
  return (
    getFileDefinition().renderer.getPortOffset?.(index) ??
    getNodePortOffset(index)
  )
}

export function createFileNodeData() {
  return getFileDefinition().createData()
}

export function getFileRuntimeOutputPorts(node: SharedWorkflowNode) {
  const outputPorts = node.data?.outputPorts?.filter(
    (port) => port.side === "right"
  )

  return outputPorts && outputPorts.length > 0
    ? outputPorts
    : [{ ...FILE_OUTPUT_PORT }]
}

export function normalizeFileRuntimeResult(
  result: unknown,
  context: FileRuntimeRunContext
): FileRuntimeResult {
  if (
    result &&
    typeof result === "object" &&
    ("output" in result || "outputs" in result)
  ) {
    return result as FileRuntimeResult
  }

  const defaultOutput = createDefaultFileRuntimeResult({
    node: context.node,
    outputPorts: context.outputPorts,
  })

  if (result === undefined) {
    return defaultOutput
  }

  return {
    output: result,
    outputs: {
      default: result,
      ports: defaultOutput.outputs?.ports,
    },
  }
}
