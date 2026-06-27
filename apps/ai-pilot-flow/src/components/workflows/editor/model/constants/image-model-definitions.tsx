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

import {
  IMAGE_MODEL_MENU_CATEGORIES,
  type ImageModelMenuCategory,
} from "@/components/workflows/editor/model/constants/image-model-presets"
import { getNodePortOffset } from "@/components/workflows/editor/model/constants/workflow-node-port-offsets"
import {
  renderImageModelBody,
  renderImageModelFooter,
} from "../../nodes/blocks/image-model/image-model-shape"

type ImageModelMode = ImageModelMenuCategory["id"]

export type ImageModelSchema = {
  fields: WorkflowNodeFieldSchema[]
}

export type ImageModelRuntimeInputs = {
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

export type ImageModelRendererProps = {
  nodeId: string
  imageModel: ImageModelDefinition
  title?: string
  inputPorts: WorkflowNodePortData[]
  outputPorts: WorkflowNodePortData[]
  addInputLabel?: string
  runLabel?: string
  showAddInputAction?: boolean
  showRunAction?: boolean
  isSelected?: boolean
  executionStatus?: WorkflowExecutionStatus
  isRunning: boolean
  onAddInputClick?: () => void
  onRunClick?: () => void
}

export type ImageModelRuntimeRunContext = {
  node: SharedWorkflowNode
  graph: SharedWorkflowGraph
  context: WorkflowRuntimeContext
  inputs: ImageModelRuntimeInputs
  outputPorts: SharedWorkflowNodePortData[]
}

export type ImageModelRuntimeResult = {
  output?: WorkflowRuntimeValue
  outputs?: WorkflowRuntimeNodeOutput
}

export type ImageModelDefinition = {
  key: string
  group: string
  label: string
  menu: {
    category: string
    searchableText?: string
  }
  mode: ImageModelMode
  schema?: ImageModelSchema
  createData: () => WorkflowNodeData
  renderer: {
    width?: string
    renderBody: (props: ImageModelRendererProps) => React.ReactNode
    renderFooter?: (props: ImageModelRendererProps) => React.ReactNode
    getPortOffset?: (index: number) => number
  }
  runtime?: {
    run: (context: ImageModelRuntimeRunContext) => unknown
  }
}

const DEFAULT_IMAGE_MODEL_SCHEMA: ImageModelSchema = {
  fields: [
    {
      key: "title",
      label: "Title",
      input: "text",
      placeholder: "Model title",
      rules: [
        {
          kind: "required",
          level: "warning",
          code: "node.image-model.title.missing",
          message: "Image model node title is empty.",
        },
      ],
    },
    {
      key: "modelKey",
      label: "Model Key",
      input: "text",
      placeholder: "flux-2-pro",
    },
    {
      key: "runLabel",
      label: "Run Label",
      input: "text",
      placeholder: "Run Model",
    },
    {
      key: "addInputLabel",
      label: "Add Input Label",
      input: "text",
      placeholder: "Add another image input",
    },
  ],
}

const PROMPT_INPUT_PORT: WorkflowNodePortData = {
  key: "prompt",
  label: "Prompt *",
  side: "left",
  labelVisibility: "hover",
  portToneClassName: "border-[#d78cff] bg-[#1c1d26]",
  labelToneClassName: "text-[#d78cff]",
}

const IMAGE_INPUT_PORT: WorkflowNodePortData = {
  key: "image-1",
  label: "Image 1",
  side: "left",
  labelVisibility: "hover",
  portToneClassName: "border-[#6fe7d1] bg-[#1c1d26]",
  labelToneClassName: "text-[#6fe7d1]",
}

const RESULT_OUTPUT_PORT: WorkflowNodePortData = {
  key: "result",
  label: "Result",
  side: "right",
  labelVisibility: "hover",
  portToneClassName: "border-[#6fe7d1] bg-[#1c1d26]",
  labelToneClassName: "text-[#6fe7d1]",
}

function clonePort(port: WorkflowNodePortData): WorkflowNodePortData {
  return { ...port }
}

function createImageModelDataByMode({
  title,
  modelKey,
  mode,
}: {
  title: string
  modelKey: string
  mode: ImageModelMode
}): WorkflowNodeData {
  const shared: WorkflowNodeData = {
    title,
    modelKey,
    outputPorts: [clonePort(RESULT_OUTPUT_PORT)],
    runLabel: "Run Model",
    showRunAction: true,
  }

  switch (mode) {
    case "generate-from-text":
    case "generate-vector-graphics":
      return {
        ...shared,
        inputPorts: [clonePort(PROMPT_INPUT_PORT)],
        addInputLabel: "Add image input",
        showAddInputAction: false,
      }
    case "edit-images":
    case "generate-from-image":
      return {
        ...shared,
        inputPorts: [clonePort(PROMPT_INPUT_PORT), clonePort(IMAGE_INPUT_PORT)],
        addInputLabel: "Add image input",
        showAddInputAction: true,
      }
    case "enhance-images":
      return {
        ...shared,
        inputPorts: [clonePort(IMAGE_INPUT_PORT)],
        addInputLabel: "Add image input",
        showAddInputAction: true,
      }
  }
}

function createDefaultImageModelRuntimeResult({
  node,
  inputs,
  outputPorts,
}: {
  node: SharedWorkflowNode
  inputs: ImageModelRuntimeInputs
  outputPorts: SharedWorkflowNodePortData[]
}): ImageModelRuntimeResult {
  const output = {
    kind: "image-model",
    nodeId: node.id,
    title: node.data?.title ?? "Image Model",
    modelKey: node.data?.modelKey ?? "image-model",
    inputs: inputs.inputsByTargetPort,
    connections: inputs.connections,
    result: `mock://image-model/${node.id}`,
  }

  const ports = outputPorts.reduce<Record<string, unknown>>((result, port) => {
    result[port.key] = {
      kind: "image-model-result",
      nodeId: node.id,
      modelKey: node.data?.modelKey ?? "image-model",
      portKey: port.key,
      value: output.result,
      inputs: inputs.inputsByTargetPort,
    }
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

function createImageModelDefinition({
  key,
  label,
  mode,
  category,
  getPortOffset = getNodePortOffset,
}: {
  key: string
  label: string
  mode: ImageModelMode
  category: string
  getPortOffset?: (index: number) => number
}): ImageModelDefinition {
  return {
    key,
    group: mode,
    label,
    menu: {
      category,
      searchableText: `${label} ${category} image model`,
    },
    mode,
    schema: DEFAULT_IMAGE_MODEL_SCHEMA,
    createData: () =>
      createImageModelDataByMode({
        title: label,
        modelKey: key,
        mode,
      }),
    renderer: {
      renderBody: renderImageModelBody,
      renderFooter: renderImageModelFooter,
      getPortOffset,
    },
    runtime: {
      run({ node, inputs, outputPorts }) {
        return createDefaultImageModelRuntimeResult({
          node,
          inputs,
          outputPorts,
        })
      },
    },
  }
}

export const IMAGE_MODEL_DEFINITIONS: readonly ImageModelDefinition[] =
  IMAGE_MODEL_MENU_CATEGORIES.flatMap((category) =>
    category.presets.map((preset) =>
      createImageModelDefinition({
        key: preset.modelKey,
        label: preset.label,
        mode: category.id,
        category: category.label,
        getPortOffset: getNodePortOffset,
      })
    )
  )

export { IMAGE_MODEL_MENU_CATEGORIES }

export function getImageModelDefinition(modelKey?: string | null) {
  if (!modelKey) {
    return undefined
  }

  return IMAGE_MODEL_DEFINITIONS.find(
    (definition) => definition.key === modelKey
  )
}

export function getDefaultImageModelDefinition() {
  return (
    getImageModelDefinition("flux-2-pro") ??
    getImageModelDefinition("chatgpt-images-2-0") ??
    IMAGE_MODEL_DEFINITIONS[0]
  )
}

export function getImageModelSchema(modelKey?: string | null) {
  return getImageModelDefinition(modelKey)?.schema
}

export function getImageModelPortOffset(
  modelKey: string | undefined,
  index: number
) {
  return (
    getImageModelDefinition(modelKey)?.renderer.getPortOffset?.(index) ??
    getNodePortOffset(index)
  )
}

export function createImageModelNodeData({
  title,
  modelKey,
  mode,
}: {
  title: string
  modelKey: string
  mode: ImageModelMode
}) {
  const definition = getImageModelDefinition(modelKey)
  const data =
    definition?.createData() ??
    createImageModelDataByMode({ title, modelKey, mode })

  return {
    ...data,
    title,
    modelKey,
  }
}

export function createDefaultImageModelNodeData() {
  return getDefaultImageModelDefinition()?.createData()
}

export function getImageModelRuntimeOutputPorts(node: SharedWorkflowNode) {
  const outputPorts = node.data?.outputPorts?.filter(
    (port) => port.side === "right"
  )

  return outputPorts && outputPorts.length > 0
    ? outputPorts
    : [{ ...RESULT_OUTPUT_PORT }]
}

export function normalizeImageModelRuntimeResult(
  result: unknown,
  context: ImageModelRuntimeRunContext
): ImageModelRuntimeResult {
  if (
    result &&
    typeof result === "object" &&
    ("output" in result || "outputs" in result)
  ) {
    return result as ImageModelRuntimeResult
  }

  const defaultOutput = createDefaultImageModelRuntimeResult({
    node: context.node,
    inputs: context.inputs,
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
