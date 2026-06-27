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
  THREE_D_MODEL_MENU_CATEGORIES,
  type ThreeDModelMenuCategory,
} from "@/components/workflows/editor/model/constants/3d-model-presets"
import { getNodePortOffset } from "@/components/workflows/editor/model/constants/workflow-node-port-offsets"
import {
  renderThreeDModelBody,
  renderThreeDModelFooter,
} from "../../nodes/blocks/3d-model/3d-model-shape"

type ThreeDModelMode = ThreeDModelMenuCategory["id"]

export type ThreeDModelSchema = {
  fields: WorkflowNodeFieldSchema[]
}

export type ThreeDModelRuntimeInputs = {
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

export type ThreeDModelRendererProps = {
  nodeId: string
  threeDModel: ThreeDModelDefinition
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

export type ThreeDModelRuntimeRunContext = {
  node: SharedWorkflowNode
  graph: SharedWorkflowGraph
  context: WorkflowRuntimeContext
  inputs: ThreeDModelRuntimeInputs
  outputPorts: SharedWorkflowNodePortData[]
}

export type ThreeDModelRuntimeResult = {
  output?: WorkflowRuntimeValue
  outputs?: WorkflowRuntimeNodeOutput
}

export type ThreeDModelDefinition = {
  key: string
  group: string
  label: string
  menu: {
    category: string
    searchableText?: string
  }
  mode: ThreeDModelMode
  schema?: ThreeDModelSchema
  createData: () => WorkflowNodeData
  renderer: {
    width?: string
    renderBody: (props: ThreeDModelRendererProps) => React.ReactNode
    renderFooter?: (props: ThreeDModelRendererProps) => React.ReactNode
    getPortOffset?: (index: number) => number
  }
  runtime?: {
    run: (context: ThreeDModelRuntimeRunContext) => unknown
  }
}

const DEFAULT_THREE_D_MODEL_SCHEMA: ThreeDModelSchema = {
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
          code: "node.3d-model.title.missing",
          message: "3D model node title is empty.",
        },
      ],
    },
    {
      key: "modelKey",
      label: "Model Key",
      input: "text",
      placeholder: "meshy-v6",
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
      placeholder: "Add image input",
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

const MODEL_INPUT_PORT: WorkflowNodePortData = {
  key: "model-1",
  label: "3D Model",
  side: "left",
  labelVisibility: "hover",
  portToneClassName: "border-[#f5c56b] bg-[#1c1d26]",
  labelToneClassName: "text-[#f5c56b]",
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

function createThreeDModelDataByMode({
  title,
  modelKey,
  mode,
}: {
  title: string
  modelKey: string
  mode: ThreeDModelMode
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
    case "generate-textures":
      return {
        ...shared,
        inputPorts: [clonePort(MODEL_INPUT_PORT)],
        addInputLabel: "Add 3D model input",
        showAddInputAction: false,
      }
  }
}

function createDefaultThreeDModelRuntimeResult({
  node,
  inputs,
  outputPorts,
}: {
  node: SharedWorkflowNode
  inputs: ThreeDModelRuntimeInputs
  outputPorts: SharedWorkflowNodePortData[]
}): ThreeDModelRuntimeResult {
  const output = {
    kind: "3d-model",
    nodeId: node.id,
    title: node.data?.title ?? "3D Model",
    modelKey: node.data?.modelKey ?? "3d-model",
    inputs: inputs.inputsByTargetPort,
    connections: inputs.connections,
    result: `mock://3d-model/${node.id}`,
  }

  const ports = outputPorts.reduce<Record<string, unknown>>((result, port) => {
    result[port.key] = {
      kind: "3d-model-result",
      nodeId: node.id,
      modelKey: node.data?.modelKey ?? "3d-model",
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

function createThreeDModelDefinition({
  key,
  label,
  mode,
  category,
  getPortOffset = getNodePortOffset,
}: {
  key: string
  label: string
  mode: ThreeDModelMode
  category: string
  getPortOffset?: (index: number) => number
}): ThreeDModelDefinition {
  return {
    key,
    group: mode,
    label,
    menu: {
      category,
      searchableText: `${label} ${category} 3d model`,
    },
    mode,
    schema: DEFAULT_THREE_D_MODEL_SCHEMA,
    createData: () =>
      createThreeDModelDataByMode({
        title: label,
        modelKey: key,
        mode,
      }),
    renderer: {
      renderBody: renderThreeDModelBody,
      renderFooter: renderThreeDModelFooter,
      getPortOffset,
    },
    runtime: {
      run({ node, inputs, outputPorts }) {
        return createDefaultThreeDModelRuntimeResult({
          node,
          inputs,
          outputPorts,
        })
      },
    },
  }
}

export const THREE_D_MODEL_DEFINITIONS: readonly ThreeDModelDefinition[] =
  THREE_D_MODEL_MENU_CATEGORIES.flatMap((category) =>
    category.presets.map((preset) =>
      createThreeDModelDefinition({
        key: preset.modelKey,
        label: preset.label,
        mode: category.id,
        category: category.label,
        getPortOffset: getNodePortOffset,
      })
    )
  )

export { THREE_D_MODEL_MENU_CATEGORIES }

export function getThreeDModelDefinition(modelKey?: string | null) {
  if (!modelKey) {
    return undefined
  }

  return THREE_D_MODEL_DEFINITIONS.find(
    (definition) => definition.key === modelKey
  )
}

export function getDefaultThreeDModelDefinition() {
  return (
    getThreeDModelDefinition("meshy-v6") ??
    getThreeDModelDefinition("patina") ??
    THREE_D_MODEL_DEFINITIONS[0]
  )
}

export function getThreeDModelSchema(modelKey?: string | null) {
  return getThreeDModelDefinition(modelKey)?.schema
}

export function getThreeDModelPortOffset(
  modelKey: string | undefined,
  index: number
) {
  return (
    getThreeDModelDefinition(modelKey)?.renderer.getPortOffset?.(index) ??
    getNodePortOffset(index)
  )
}

export function createThreeDModelNodeData({
  title,
  modelKey,
  mode,
}: {
  title: string
  modelKey: string
  mode: ThreeDModelMode
}) {
  const definition = getThreeDModelDefinition(modelKey)
  const data =
    definition?.createData() ??
    createThreeDModelDataByMode({ title, modelKey, mode })

  return {
    ...data,
    title,
    modelKey,
  }
}

export function createDefaultThreeDModelNodeData() {
  return getDefaultThreeDModelDefinition()?.createData()
}

export function getThreeDModelRuntimeOutputPorts(node: SharedWorkflowNode) {
  const outputPorts = node.data?.outputPorts?.filter(
    (port) => port.side === "right"
  )

  return outputPorts && outputPorts.length > 0
    ? outputPorts
    : [{ ...RESULT_OUTPUT_PORT }]
}

export function normalizeThreeDModelRuntimeResult(
  result: unknown,
  context: ThreeDModelRuntimeRunContext
): ThreeDModelRuntimeResult {
  if (
    result &&
    typeof result === "object" &&
    ("output" in result || "outputs" in result)
  ) {
    return result as ThreeDModelRuntimeResult
  }

  const defaultOutput = createDefaultThreeDModelRuntimeResult({
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
