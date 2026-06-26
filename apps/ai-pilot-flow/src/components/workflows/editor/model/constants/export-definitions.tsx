"use client"

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
import { renderExportBody } from "@/components/workflows/editor/nodes/blocks/export/export-shape"

export type ExportSchema = {
  fields: WorkflowNodeFieldSchema[]
}

export type ExportRuntimeInputs = {
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

export type ExportRendererProps = {
  nodeId: string
  exportNode: ExportDefinition
  title?: string
  inputPorts: WorkflowNodePortData[]
  actionLabel?: string
  isSelected?: boolean
  executionStatus?: WorkflowExecutionStatus
  isRunning: boolean
}

export type ExportRuntimeRunContext = {
  node: SharedWorkflowNode
  graph: SharedWorkflowGraph
  context: WorkflowRuntimeContext
  inputPorts: SharedWorkflowNodePortData[]
  inputs: ExportRuntimeInputs
}

export type ExportRuntimeResult = {
  output?: WorkflowRuntimeValue
  outputs?: WorkflowRuntimeNodeOutput
}

export type ExportDefinition = {
  key: string
  label: string
  menu: {
    searchableText?: string
  }
  schema?: ExportSchema
  createData: () => WorkflowNodeData
  renderer: {
    width?: string
    renderBody: (props: ExportRendererProps) => React.ReactNode
    renderFooter?: (props: ExportRendererProps) => React.ReactNode
    getPortOffset?: (index: number) => number
  }
  runtime?: {
    run: (context: ExportRuntimeRunContext) => unknown
  }
}

const DEFAULT_EXPORT_SCHEMA: ExportSchema = {
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
          code: "node.export.title.missing",
          message: "Export node title is empty.",
        },
      ],
    },
    {
      key: "inputLabel",
      label: "Input Label",
      input: "text",
      placeholder: "Input label",
    },
    {
      key: "actionLabel",
      label: "Action Label",
      input: "text",
      placeholder: "Action label",
      rules: [
        {
          kind: "required",
          level: "warning",
          code: "node.export.action-label.missing",
          message: "Export node action label is empty.",
        },
      ],
    },
  ],
}

const EXPORT_INPUT_PORT: WorkflowNodePortData = {
  key: "input",
  label: "Input",
  side: "left",
  labelVisibility: "hover",
}

function clonePort(port: WorkflowNodePortData): WorkflowNodePortData {
  return { ...port }
}

function defaultGetPortOffset(index: number) {
  return 72 + index * 80
}

function createDefaultExportRuntimeResult({
  node,
  inputs,
}: {
  node: SharedWorkflowNode
  inputs: ExportRuntimeInputs
}): ExportRuntimeResult {
  const inputValues = inputs.inputsByTargetPort.input ?? inputs.upstreamOutputs
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
    outputs: {
      default: output,
    },
  }
}

export const EXPORT_DEFINITIONS: readonly ExportDefinition[] = [
  {
    key: "export",
    label: "Export",
    menu: {
      searchableText: "export save download result output",
    },
    schema: DEFAULT_EXPORT_SCHEMA,
    createData: () => ({
      title: "Export",
      inputLabel: "Input",
      actionLabel: "Export",
      inputPorts: [clonePort(EXPORT_INPUT_PORT)],
      showAddInputAction: false,
      showRunAction: false,
    }),
    renderer: {
      renderBody: renderExportBody,
      getPortOffset: () => 104,
    },
    runtime: {
      run({ node, inputs }) {
        return createDefaultExportRuntimeResult({
          node,
          inputs,
        })
      },
    },
  },
] as const

export function getExportDefinition() {
  return EXPORT_DEFINITIONS[0]!
}

export function getExportSchema() {
  return getExportDefinition().schema
}

export function getExportPortOffset(index: number) {
  return (
    getExportDefinition().renderer.getPortOffset?.(index) ??
    defaultGetPortOffset(index)
  )
}

export function createExportNodeData() {
  return getExportDefinition().createData()
}

export function getExportRuntimeInputPorts(node: SharedWorkflowNode) {
  const inputPorts = node.data?.inputPorts?.filter(
    (port) => port.side === "left"
  )

  return inputPorts && inputPorts.length > 0
    ? inputPorts
    : [{ ...EXPORT_INPUT_PORT }]
}

export function normalizeExportRuntimeResult(
  result: unknown,
  context: ExportRuntimeRunContext
): ExportRuntimeResult {
  if (
    result &&
    typeof result === "object" &&
    ("output" in result || "outputs" in result)
  ) {
    return result as ExportRuntimeResult
  }

  const defaultOutput = createDefaultExportRuntimeResult({
    node: context.node,
    inputs: context.inputs,
  })

  if (result === undefined) {
    return defaultOutput
  }

  return {
    output: result,
    outputs: {
      default: result,
    },
  }
}
