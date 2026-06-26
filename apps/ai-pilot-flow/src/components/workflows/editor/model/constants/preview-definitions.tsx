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
import { renderPreviewBody } from "@/components/workflows/editor/nodes/blocks/preview/preview-shape"

export type PreviewSchema = {
  fields: WorkflowNodeFieldSchema[]
}

export type PreviewRuntimeInputs = {
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

export type PreviewRendererProps = {
  nodeId: string
  preview: PreviewDefinition
  title?: string
  inputPorts: WorkflowNodePortData[]
  isSelected?: boolean
  executionStatus?: WorkflowExecutionStatus
  isRunning: boolean
}

export type PreviewRuntimeRunContext = {
  node: SharedWorkflowNode
  graph: SharedWorkflowGraph
  context: WorkflowRuntimeContext
  inputPorts: SharedWorkflowNodePortData[]
  inputs: PreviewRuntimeInputs
}

export type PreviewRuntimeResult = {
  output?: WorkflowRuntimeValue
  outputs?: WorkflowRuntimeNodeOutput
}

export type PreviewDefinition = {
  key: string
  label: string
  menu: {
    searchableText?: string
  }
  schema?: PreviewSchema
  createData: () => WorkflowNodeData
  renderer: {
    width?: string
    renderBody: (props: PreviewRendererProps) => React.ReactNode
    renderFooter?: (props: PreviewRendererProps) => React.ReactNode
    getPortOffset?: (index: number) => number
  }
  runtime?: {
    run: (context: PreviewRuntimeRunContext) => unknown
  }
}

const DEFAULT_PREVIEW_SCHEMA: PreviewSchema = {
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
          code: "node.preview.title.missing",
          message: "Preview node title is empty.",
        },
      ],
    },
    {
      key: "inputLabel",
      label: "Input Label",
      input: "text",
      placeholder: "Input label",
    },
  ],
}

const PREVIEW_INPUT_PORT: WorkflowNodePortData = {
  key: "input",
  label: "File",
  side: "left",
  labelVisibility: "hover",
}

function clonePort(port: WorkflowNodePortData): WorkflowNodePortData {
  return { ...port }
}

function defaultGetPortOffset(index: number) {
  return 72 + index * 80
}

function createDefaultPreviewRuntimeResult({
  node,
  inputs,
}: {
  node: SharedWorkflowNode
  inputs: PreviewRuntimeInputs
}): PreviewRuntimeResult {
  const sourceValues = inputs.inputsByTargetPort.input ?? inputs.upstreamOutputs
  const output = {
    kind: "preview",
    nodeId: node.id,
    title: node.data?.title ?? "Preview",
    inputLabel: node.data?.inputLabel ?? "File",
    source: sourceValues.length === 1 ? sourceValues[0] : sourceValues,
  }

  return {
    output,
    outputs: {
      default: output,
    },
  }
}

export const PREVIEW_DEFINITIONS: readonly PreviewDefinition[] = [
  {
    key: "preview",
    label: "Preview",
    menu: {
      searchableText: "preview image canvas result output viewer",
    },
    schema: DEFAULT_PREVIEW_SCHEMA,
    createData: () => ({
      title: "Preview",
      inputLabel: "File",
      inputPorts: [clonePort(PREVIEW_INPUT_PORT)],
      showAddInputAction: false,
      showRunAction: false,
    }),
    renderer: {
      renderBody: renderPreviewBody,
      getPortOffset: () => 104,
    },
    runtime: {
      run({ node, inputs }) {
        return createDefaultPreviewRuntimeResult({
          node,
          inputs,
        })
      },
    },
  },
] as const

export function getPreviewDefinition() {
  return PREVIEW_DEFINITIONS[0]!
}

export function getPreviewSchema() {
  return getPreviewDefinition().schema
}

export function getPreviewPortOffset(index: number) {
  return (
    getPreviewDefinition().renderer.getPortOffset?.(index) ??
    defaultGetPortOffset(index)
  )
}

export function createPreviewNodeData() {
  return getPreviewDefinition().createData()
}

export function getPreviewRuntimeInputPorts(node: SharedWorkflowNode) {
  const inputPorts = node.data?.inputPorts?.filter(
    (port) => port.side === "left"
  )

  return inputPorts && inputPorts.length > 0
    ? inputPorts
    : [{ ...PREVIEW_INPUT_PORT }]
}

export function normalizePreviewRuntimeResult(
  result: unknown,
  context: PreviewRuntimeRunContext
): PreviewRuntimeResult {
  if (
    result &&
    typeof result === "object" &&
    ("output" in result || "outputs" in result)
  ) {
    return result as PreviewRuntimeResult
  }

  const defaultOutput = createDefaultPreviewRuntimeResult({
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
