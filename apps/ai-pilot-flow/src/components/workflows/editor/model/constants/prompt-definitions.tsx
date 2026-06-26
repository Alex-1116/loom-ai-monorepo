"use client"

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
  WorkflowRuntimeNodeOutput,
  WorkflowRuntimeValue,
  WorkflowExecutionStatus,
} from "@/components/workflows/shared/types/workflow-runtime"
import {
  renderPromptBody,
  renderPromptFooter,
} from "@/components/workflows/editor/nodes/blocks/prompt/prompt-shape"

export const DEFAULT_PROMPT_NODE_CONTENT =
  'Hipster Sphus, lime overall suit, pushing a huge round rock up a hill. The rock is sprayed with the text "default prompt", bright grey background extreme side long shot, cinematic, fashion style, side view'

export type PromptSchema = {
  fields: WorkflowNodeFieldSchema[]
}

export type PromptRendererProps = {
  nodeId: string
  prompt: PromptDefinition
  title?: string
  content?: string
  outputPorts: WorkflowNodePortData[]
  addInputLabel?: string
  showAddInputAction?: boolean
  isSelected?: boolean
  executionStatus?: WorkflowExecutionStatus
  isRunning: boolean
  onAddVariableClick?: () => void
  onContentChange?: (value: string) => void
  onContentCommit?: () => void
}

export type PromptRuntimeRunContext = {
  node: SharedWorkflowNode
  graph: SharedWorkflowGraph
  context: WorkflowRuntimeContext
  outputPorts: SharedWorkflowNodePortData[]
}

export type PromptRuntimeResult = {
  output?: WorkflowRuntimeValue
  outputs?: WorkflowRuntimeNodeOutput
}

export type PromptDefinition = {
  key: string
  label: string
  menu: {
    searchableText?: string
  }
  schema?: PromptSchema
  createData: () => WorkflowNodeData
  renderer: {
    width?: string
    renderBody: (props: PromptRendererProps) => React.ReactNode
    renderFooter?: (props: PromptRendererProps) => React.ReactNode
    getPortOffset?: (index: number) => number
  }
  runtime?: {
    run: (context: PromptRuntimeRunContext) => unknown
  }
}

const DEFAULT_PROMPT_SCHEMA: PromptSchema = {
  fields: [
    {
      key: "title",
      label: "Title",
      input: "text",
      placeholder: "Prompt",
      rules: [
        {
          kind: "required",
          level: "warning",
          code: "node.prompt.title.missing",
          message: "Prompt node title is empty.",
        },
      ],
    },
    {
      key: "content",
      label: "Content",
      input: "textarea",
      placeholder: "Write your prompt here",
      rules: [
        {
          kind: "required",
          level: "warning",
          code: "node.prompt.content.missing",
          message: "Prompt node content is empty.",
        },
      ],
    },
    {
      key: "addInputLabel",
      label: "Add Variable Label",
      input: "text",
      placeholder: "Add variable",
    },
  ],
}

const PROMPT_OUTPUT_PORT: WorkflowNodePortData = {
  key: "prompt",
  label: "Prompt",
  side: "right",
  labelVisibility: "hover",
  portToneClassName: "border-[#d78cff] bg-[#1c1d26]",
  labelToneClassName: "text-[#d78cff]",
}

function clonePort(port: WorkflowNodePortData): WorkflowNodePortData {
  return { ...port }
}

function defaultGetPortOffset(index: number) {
  return 72 + index * 80
}

function createDefaultPromptOutput({
  node,
  outputPorts,
}: {
  node: SharedWorkflowNode
  outputPorts: SharedWorkflowNodePortData[]
}): PromptRuntimeResult {
  const content = node.data?.content ?? ""
  const output = {
    kind: "prompt",
    nodeId: node.id,
    title: node.data?.title ?? "Prompt",
    content,
    text: content,
  }

  const ports = outputPorts.reduce<Record<string, string>>((result, port) => {
    result[port.key] = content
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

export const PROMPT_DEFINITIONS: readonly PromptDefinition[] = [
  {
    key: "prompt",
    label: "Prompt",
    menu: {
      searchableText: "text prompt prompt composer",
    },
    schema: DEFAULT_PROMPT_SCHEMA,
    createData: () => ({
      title: "Prompt",
      content: DEFAULT_PROMPT_NODE_CONTENT,
      outputPorts: [clonePort(PROMPT_OUTPUT_PORT)],
      addInputLabel: "Add variable",
      showAddInputAction: true,
      showRunAction: false,
    }),
    renderer: {
      renderBody: renderPromptBody,
      renderFooter: renderPromptFooter,
      getPortOffset: () => 104,
    },
    runtime: {
      run({ node, outputPorts }) {
        return createDefaultPromptOutput({
          node,
          outputPorts,
        })
      },
    },
  },
] as const

export function getPromptDefinition() {
  return PROMPT_DEFINITIONS[0]!
}

export function getPromptSchema() {
  return getPromptDefinition()?.schema
}

export function getPromptPortOffset(index: number) {
  return (
    getPromptDefinition()?.renderer.getPortOffset?.(index) ??
    defaultGetPortOffset(index)
  )
}

export function createPromptNodeData() {
  return getPromptDefinition().createData()
}

export function getPromptRuntimeOutputPorts(node: SharedWorkflowNode) {
  const outputPorts = node.data?.outputPorts?.filter(
    (port) => port.side === "right"
  )

  return outputPorts && outputPorts.length > 0
    ? outputPorts
    : [{ ...PROMPT_OUTPUT_PORT }]
}

export function normalizePromptRuntimeResult(
  result: unknown,
  context: PromptRuntimeRunContext
): PromptRuntimeResult {
  if (
    result &&
    typeof result === "object" &&
    ("output" in result || "outputs" in result)
  ) {
    return result as PromptRuntimeResult
  }

  const defaultOutput = createDefaultPromptOutput({
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
