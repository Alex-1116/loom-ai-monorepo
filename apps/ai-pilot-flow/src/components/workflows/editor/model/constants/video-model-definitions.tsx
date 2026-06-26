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
  VIDEO_MODEL_MENU_CATEGORIES,
  type VideoModelMenuCategory,
} from "@/components/workflows/editor/model/constants/video-model-presets"
import {
  renderVideoModelBody,
  renderVideoModelFooter,
} from "../../nodes/blocks/video-model/video-model-shape"

type VideoModelMode = VideoModelMenuCategory["id"]

export type VideoModelSchema = {
  fields: WorkflowNodeFieldSchema[]
}

export type VideoModelRuntimeInputs = {
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

export type VideoModelRendererProps = {
  nodeId: string
  videoModel: VideoModelDefinition
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

export type VideoModelRuntimeRunContext = {
  node: SharedWorkflowNode
  graph: SharedWorkflowGraph
  context: WorkflowRuntimeContext
  inputs: VideoModelRuntimeInputs
  outputPorts: SharedWorkflowNodePortData[]
}

export type VideoModelRuntimeResult = {
  output?: WorkflowRuntimeValue
  outputs?: WorkflowRuntimeNodeOutput
}

export type VideoModelDefinition = {
  key: string
  group: string
  label: string
  menu: {
    category: string
    searchableText?: string
  }
  mode: VideoModelMode
  schema?: VideoModelSchema
  createData: () => WorkflowNodeData
  renderer: {
    width?: string
    renderBody: (props: VideoModelRendererProps) => React.ReactNode
    renderFooter?: (props: VideoModelRendererProps) => React.ReactNode
    getPortOffset?: (index: number) => number
  }
  runtime?: {
    run: (context: VideoModelRuntimeRunContext) => unknown
  }
}

const DEFAULT_VIDEO_MODEL_SCHEMA: VideoModelSchema = {
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
          code: "node.video-model.title.missing",
          message: "Video model node title is empty.",
        },
      ],
    },
    {
      key: "modelKey",
      label: "Model Key",
      input: "text",
      placeholder: "kling-3-0-turbo",
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
      placeholder: "Add another input",
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

const VIDEO_INPUT_PORT: WorkflowNodePortData = {
  key: "video-1",
  label: "Video 1",
  side: "left",
  labelVisibility: "hover",
  portToneClassName: "border-[#6fe7d1] bg-[#1c1d26]",
  labelToneClassName: "text-[#6fe7d1]",
}

const AUDIO_INPUT_PORT: WorkflowNodePortData = {
  key: "audio",
  label: "Audio",
  side: "left",
  labelVisibility: "hover",
  portToneClassName: "border-[#f9a8d4] bg-[#1c1d26]",
  labelToneClassName: "text-[#f9a8d4]",
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

function defaultGetPortOffset(index: number) {
  return 72 + index * 80
}

function createVideoModelDataByMode({
  title,
  modelKey,
  mode,
}: {
  title: string
  modelKey: string
  mode: VideoModelMode
}): WorkflowNodeData {
  const shared: WorkflowNodeData = {
    title,
    modelKey,
    outputPorts: [clonePort(RESULT_OUTPUT_PORT)],
    runLabel: "Run Model",
    showRunAction: true,
  }

  switch (mode) {
    case "generate-from-text-or-image":
      return {
        ...shared,
        inputPorts: [clonePort(PROMPT_INPUT_PORT), clonePort(IMAGE_INPUT_PORT)],
        addInputLabel: "Add image input",
        showAddInputAction: true,
      }
    case "generate-from-video":
      return {
        ...shared,
        inputPorts: [clonePort(PROMPT_INPUT_PORT), clonePort(VIDEO_INPUT_PORT)],
        addInputLabel: "Add video input",
        showAddInputAction: true,
      }
    case "lip-sync":
      return {
        ...shared,
        inputPorts: [clonePort(VIDEO_INPUT_PORT), clonePort(AUDIO_INPUT_PORT)],
        addInputLabel: "Add source input",
        showAddInputAction: false,
      }
    case "enhance-videos":
      return {
        ...shared,
        inputPorts: [clonePort(VIDEO_INPUT_PORT)],
        addInputLabel: "Add video input",
        showAddInputAction: true,
      }
  }
}

function createDefaultVideoModelRuntimeResult({
  node,
  inputs,
  outputPorts,
}: {
  node: SharedWorkflowNode
  inputs: VideoModelRuntimeInputs
  outputPorts: SharedWorkflowNodePortData[]
}): VideoModelRuntimeResult {
  const output = {
    kind: "video-model",
    nodeId: node.id,
    title: node.data?.title ?? "Video Model",
    modelKey: node.data?.modelKey ?? "video-model",
    inputs: inputs.inputsByTargetPort,
    connections: inputs.connections,
    result: `mock://video-model/${node.id}`,
  }

  const ports = outputPorts.reduce<Record<string, unknown>>((result, port) => {
    result[port.key] = {
      kind: "video-model-result",
      nodeId: node.id,
      modelKey: node.data?.modelKey ?? "video-model",
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

function createVideoModelDefinition({
  key,
  label,
  mode,
  category,
  getPortOffset = defaultGetPortOffset,
}: {
  key: string
  label: string
  mode: VideoModelMode
  category: string
  getPortOffset?: (index: number) => number
}): VideoModelDefinition {
  return {
    key,
    group: mode,
    label,
    menu: {
      category,
      searchableText: `${label} ${category} video model`,
    },
    mode,
    schema: DEFAULT_VIDEO_MODEL_SCHEMA,
    createData: () =>
      createVideoModelDataByMode({
        title: label,
        modelKey: key,
        mode,
      }),
    renderer: {
      renderBody: renderVideoModelBody,
      renderFooter: renderVideoModelFooter,
      getPortOffset,
    },
    runtime: {
      run({ node, inputs, outputPorts }) {
        return createDefaultVideoModelRuntimeResult({
          node,
          inputs,
          outputPorts,
        })
      },
    },
  }
}

export const VIDEO_MODEL_DEFINITIONS: readonly VideoModelDefinition[] =
  VIDEO_MODEL_MENU_CATEGORIES.flatMap((category) =>
    category.presets.map((preset) =>
      createVideoModelDefinition({
        key: preset.modelKey,
        label: preset.label,
        mode: category.id,
        category: category.label,
        getPortOffset: () => 104,
      })
    )
  )

export { VIDEO_MODEL_MENU_CATEGORIES }

export function getVideoModelDefinition(modelKey?: string | null) {
  if (!modelKey) {
    return undefined
  }

  return VIDEO_MODEL_DEFINITIONS.find(
    (definition) => definition.key === modelKey
  )
}

export function getDefaultVideoModelDefinition() {
  return (
    getVideoModelDefinition("kling-3-0-turbo") ??
    getVideoModelDefinition("runway-gen-4-5") ??
    VIDEO_MODEL_DEFINITIONS[0]
  )
}

export function getVideoModelSchema(modelKey?: string | null) {
  return getVideoModelDefinition(modelKey)?.schema
}

export function getVideoModelPortOffset(
  modelKey: string | undefined,
  index: number
) {
  return (
    getVideoModelDefinition(modelKey)?.renderer.getPortOffset?.(index) ??
    defaultGetPortOffset(index)
  )
}

export function createVideoModelNodeData({
  title,
  modelKey,
  mode,
}: {
  title: string
  modelKey: string
  mode: VideoModelMode
}) {
  const definition = getVideoModelDefinition(modelKey)
  const data =
    definition?.createData() ??
    createVideoModelDataByMode({ title, modelKey, mode })

  return {
    ...data,
    title,
    modelKey,
  }
}

export function createDefaultVideoModelNodeData() {
  return getDefaultVideoModelDefinition()?.createData()
}

export function getVideoModelRuntimeOutputPorts(node: SharedWorkflowNode) {
  const outputPorts = node.data?.outputPorts?.filter(
    (port) => port.side === "right"
  )

  return outputPorts && outputPorts.length > 0
    ? outputPorts
    : [{ ...RESULT_OUTPUT_PORT }]
}

export function normalizeVideoModelRuntimeResult(
  result: unknown,
  context: VideoModelRuntimeRunContext
): VideoModelRuntimeResult {
  if (
    result &&
    typeof result === "object" &&
    ("output" in result || "outputs" in result)
  ) {
    return result as VideoModelRuntimeResult
  }

  const defaultOutput = createDefaultVideoModelRuntimeResult({
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
