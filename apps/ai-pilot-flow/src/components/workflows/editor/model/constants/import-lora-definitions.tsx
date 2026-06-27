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
import { renderImportLoraBody } from "../../nodes/blocks/import-lora/import-lora-shape"

export type ImportLoraSchema = {
  fields: WorkflowNodeFieldSchema[]
}

export type ImportLoraRendererProps = {
  nodeId: string
  importLora: ImportLoraDefinition
  title?: string
  outputLabel?: string
  outputPorts: WorkflowNodePortData[]
  isSelected?: boolean
  executionStatus?: WorkflowExecutionStatus
  isRunning: boolean
}

export type ImportLoraRuntimeRunContext = {
  node: SharedWorkflowNode
  graph: SharedWorkflowGraph
  context: WorkflowRuntimeContext
  outputPorts: SharedWorkflowNodePortData[]
}

export type ImportLoraRuntimeResult = {
  output?: WorkflowRuntimeValue
  outputs?: WorkflowRuntimeNodeOutput
}

export type ImportLoraDefinition = {
  key: string
  label: string
  menu: {
    searchableText?: string
  }
  schema?: ImportLoraSchema
  createData: () => WorkflowNodeData
  renderer: {
    width?: string
    renderBody: (props: ImportLoraRendererProps) => React.ReactNode
    renderFooter?: (props: ImportLoraRendererProps) => React.ReactNode
    getPortOffset?: (index: number) => number
  }
  runtime?: {
    run: (context: ImportLoraRuntimeRunContext) => unknown
  }
}

const DEFAULT_IMPORT_LORA_SCHEMA: ImportLoraSchema = {
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
          code: "node.import-lora.title.missing",
          message: "Import LoRA node title is empty.",
        },
      ],
    },
    {
      key: "outputLabel",
      label: "Output Label",
      input: "text",
      placeholder: "Output label",
      rules: [
        {
          kind: "required",
          level: "warning",
          code: "node.import-lora.output-label.missing",
          message: "Import LoRA output label is empty.",
        },
      ],
    },
  ],
}

const IMPORT_LORA_OUTPUT_PORT: WorkflowNodePortData = {
  key: "output",
  label: "LoRA URL",
  side: "right",
  labelVisibility: "hover",
}

function clonePort(port: WorkflowNodePortData): WorkflowNodePortData {
  return { ...port }
}

function createDefaultImportLoraRuntimeResult({
  node,
  outputPorts,
}: {
  node: SharedWorkflowNode
  outputPorts: SharedWorkflowNodePortData[]
}): ImportLoraRuntimeResult {
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

export const IMPORT_LORA_DEFINITIONS: readonly ImportLoraDefinition[] = [
  {
    key: "import-lora",
    label: "Import LoRA",
    menu: {
      searchableText: "import lora checkpoint model weight upload",
    },
    schema: DEFAULT_IMPORT_LORA_SCHEMA,
    createData: () => ({
      title: "Import LoRA",
      outputLabel: "LoRA URL",
      outputPorts: [clonePort(IMPORT_LORA_OUTPUT_PORT)],
      showAddInputAction: false,
      showRunAction: false,
    }),
    renderer: {
      renderBody: renderImportLoraBody,
      getPortOffset: getNodePortOffset,
    },
    runtime: {
      run({ node, outputPorts }) {
        return createDefaultImportLoraRuntimeResult({
          node,
          outputPorts,
        })
      },
    },
  },
] as const

export function getImportLoraDefinition() {
  return IMPORT_LORA_DEFINITIONS[0]!
}

export function getImportLoraSchema() {
  return getImportLoraDefinition().schema
}

export function getImportLoraPortOffset(index: number) {
  return (
    getImportLoraDefinition().renderer.getPortOffset?.(index) ??
    getNodePortOffset(index)
  )
}

export function createImportLoraNodeData() {
  return getImportLoraDefinition().createData()
}

export function getImportLoraRuntimeOutputPorts(node: SharedWorkflowNode) {
  const outputPorts = node.data?.outputPorts?.filter(
    (port) => port.side === "right"
  )

  return outputPorts && outputPorts.length > 0
    ? outputPorts
    : [{ ...IMPORT_LORA_OUTPUT_PORT }]
}

export function normalizeImportLoraRuntimeResult(
  result: unknown,
  context: ImportLoraRuntimeRunContext
): ImportLoraRuntimeResult {
  if (
    result &&
    typeof result === "object" &&
    ("output" in result || "outputs" in result)
  ) {
    return result as ImportLoraRuntimeResult
  }

  const defaultOutput = createDefaultImportLoraRuntimeResult({
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
