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
import { renderImportMultipleLorasBody } from "@/components/workflows/editor/nodes/blocks/import-multiple-loras/import-multiple-loras-shape"

export type ImportMultipleLorasSchema = {
  fields: WorkflowNodeFieldSchema[]
}

export type ImportMultipleLorasRendererProps = {
  nodeId: string
  importMultipleLoras: ImportMultipleLorasDefinition
  title?: string
  outputLabel?: string
  secondaryOutputLabel?: string
  outputPorts: WorkflowNodePortData[]
  isSelected?: boolean
  executionStatus?: WorkflowExecutionStatus
  isRunning: boolean
}

export type ImportMultipleLorasRuntimeRunContext = {
  node: SharedWorkflowNode
  graph: SharedWorkflowGraph
  context: WorkflowRuntimeContext
  outputPorts: SharedWorkflowNodePortData[]
}

export type ImportMultipleLorasRuntimeResult = {
  output?: WorkflowRuntimeValue
  outputs?: WorkflowRuntimeNodeOutput
}

export type ImportMultipleLorasDefinition = {
  key: string
  label: string
  menu: {
    searchableText?: string
  }
  schema?: ImportMultipleLorasSchema
  createData: () => WorkflowNodeData
  renderer: {
    width?: string
    renderBody: (props: ImportMultipleLorasRendererProps) => React.ReactNode
    renderFooter?: (props: ImportMultipleLorasRendererProps) => React.ReactNode
    getPortOffset?: (index: number) => number
  }
  runtime?: {
    run: (context: ImportMultipleLorasRuntimeRunContext) => unknown
  }
}

const DEFAULT_IMPORT_MULTIPLE_LORAS_SCHEMA: ImportMultipleLorasSchema = {
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
          code: "node.import-multiple-loras.title.missing",
          message: "Import Multiple LoRAs node title is empty.",
        },
      ],
    },
    {
      key: "outputLabel",
      label: "Primary Output Label",
      input: "text",
      placeholder: "Primary output label",
      rules: [
        {
          kind: "required",
          level: "warning",
          code: "node.import-multiple-loras.output-label.missing",
          message: "Import Multiple LoRAs primary output label is empty.",
        },
      ],
    },
    {
      key: "secondaryOutputLabel",
      label: "Secondary Output Label",
      input: "text",
      placeholder: "Secondary output label",
      rules: [
        {
          kind: "required",
          level: "warning",
          code: "node.import-multiple-loras.secondary-output-label.missing",
          message: "Import Multiple LoRAs secondary output label is empty.",
        },
      ],
    },
  ],
}

const IMPORT_MULTIPLE_LORAS_OUTPUT_PORT: WorkflowNodePortData = {
  key: "lora-url",
  label: "LoRA URL",
  side: "right",
  labelVisibility: "hover",
  portToneClassName: "border-[#d88cff] bg-[#1c1d26]",
  labelToneClassName: "text-[#d88cff]/70",
}

const IMPORT_MULTIPLE_LORAS_WEIGHT_PORT: WorkflowNodePortData = {
  key: "weight",
  label: "Weight",
  side: "right",
  labelVisibility: "hover",
  portToneClassName: "border-[#ace3b3] bg-[#1c1d26]",
  labelToneClassName: "text-[#ace3b3]/70",
}

function clonePort(port: WorkflowNodePortData): WorkflowNodePortData {
  return { ...port }
}

function defaultGetPortOffset(index: number) {
  return 72 + index * 80
}

function createDefaultImportMultipleLorasRuntimeResult({
  node,
  outputPorts,
}: {
  node: SharedWorkflowNode
  outputPorts: SharedWorkflowNodePortData[]
}): ImportMultipleLorasRuntimeResult {
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

  const defaultPortOutputs = {
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
  }

  const ports = outputPorts.reduce<Record<string, unknown>>((result, port) => {
    result[port.key] =
      defaultPortOutputs[port.key as keyof typeof defaultPortOutputs]
    return result
  }, {})

  return {
    output,
    outputs: {
      default: output,
      ports,
    },
  }
}

export const IMPORT_MULTIPLE_LORAS_DEFINITIONS: readonly ImportMultipleLorasDefinition[] =
  [
    {
      key: "import-multiple-loras",
      label: "Import Multiple LoRAs",
      menu: {
        searchableText: "import multiple loras batch weights model upload",
      },
      schema: DEFAULT_IMPORT_MULTIPLE_LORAS_SCHEMA,
      createData: () => ({
        title: "Import Multiple LoRAs",
        outputLabel: "LoRA URL",
        secondaryOutputLabel: "Weight",
        outputPorts: [
          clonePort(IMPORT_MULTIPLE_LORAS_OUTPUT_PORT),
          clonePort(IMPORT_MULTIPLE_LORAS_WEIGHT_PORT),
        ],
        showAddInputAction: false,
        showRunAction: false,
      }),
      renderer: {
        renderBody: renderImportMultipleLorasBody,
      },
      runtime: {
        run({ node, outputPorts }) {
          return createDefaultImportMultipleLorasRuntimeResult({
            node,
            outputPorts,
          })
        },
      },
    },
  ] as const

export function getImportMultipleLorasDefinition() {
  return IMPORT_MULTIPLE_LORAS_DEFINITIONS[0]!
}

export function getImportMultipleLorasSchema() {
  return getImportMultipleLorasDefinition().schema
}

export function getImportMultipleLorasPortOffset(index: number) {
  return (
    getImportMultipleLorasDefinition().renderer.getPortOffset?.(index) ??
    defaultGetPortOffset(index)
  )
}

export function createImportMultipleLorasNodeData() {
  return getImportMultipleLorasDefinition().createData()
}

export function getImportMultipleLorasRuntimeOutputPorts(
  node: SharedWorkflowNode
) {
  const outputPorts = node.data?.outputPorts?.filter(
    (port) => port.side === "right"
  )

  return outputPorts && outputPorts.length > 0
    ? outputPorts
    : [
        { ...IMPORT_MULTIPLE_LORAS_OUTPUT_PORT },
        { ...IMPORT_MULTIPLE_LORAS_WEIGHT_PORT },
      ]
}

export function normalizeImportMultipleLorasRuntimeResult(
  result: unknown,
  context: ImportMultipleLorasRuntimeRunContext
): ImportMultipleLorasRuntimeResult {
  if (
    result &&
    typeof result === "object" &&
    ("output" in result || "outputs" in result)
  ) {
    return result as ImportMultipleLorasRuntimeResult
  }

  const defaultOutput = createDefaultImportMultipleLorasRuntimeResult({
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
