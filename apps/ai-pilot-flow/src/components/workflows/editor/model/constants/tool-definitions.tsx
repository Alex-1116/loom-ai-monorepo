import * as React from "react"

import type { WorkflowNodeFieldSchema } from "@/components/workflows/editor/model/schema/node-schema"
import type {
  WorkflowNodeData,
  WorkflowNodePortData,
} from "@/components/workflows/editor/model/types/workflow-node"
import type { WorkflowRuntimeContext } from "@/components/workflows/runtime/context/workflow-runtime-context"
import type { WorkflowNodeRunResult } from "@/components/workflows/runtime/runner/workflow-node-runner"
import type {
  SharedWorkflowGraph,
  SharedWorkflowNode,
  SharedWorkflowNodePortData,
  WorkflowExecutionStatus,
  WorkflowRuntimeValue,
} from "@/components/workflows/shared/types/workflow-runtime"
import { getNodePortOffset } from "@/components/workflows/editor/model/constants/workflow-node-port-offsets"
import {
  renderAudioDescriberBody,
  renderAudioDescriberTitle,
  renderAnyLlmBody,
  renderBlurBody,
  renderChannelsBody,
  renderCompositorBody,
  renderCompositorFooter,
  renderColorCorrectionBody,
  renderColorCorrectionFooter,
  renderColorPaletteBody,
  renderCropBody,
  renderExportBody,
  renderLevelsBody,
  renderLevelsFooter,
  renderExtractVideoFrameBody,
  renderExtractVideoMatteBody,
  renderExtractVideoMatteTitle,
  renderImageDescriberBody,
  renderImageIteratorBody,
  renderImageIteratorTitle,
  renderImportBody,
  renderImportLoraBody,
  renderImportMultipleLorasBody,
  renderInvertBody,
  renderMaskByTextBody,
  renderMaskByTextTitle,
  renderMergeAlphaBody,
  renderMatteGrowShrinkBody,
  renderMatteGrowShrinkTitle,
  renderOutputTitle,
  renderPainterBody,
  renderPainterTitle,
  renderPromptConcatenatorBody,
  renderPromptEnhancerBody,
  renderPromptBody,
  renderPromptFooter,
  renderPreviewBody,
  renderResizeBody,
  renderRouterTitle,
  renderTextIteratorBody,
  renderTextIteratorFooter,
  renderTextIteratorHeaderActions,
  renderTextIteratorTitle,
  renderMaskExtractorBody,
  renderMaskExtractorFooter,
  renderVideoConcatenatorBody,
  renderVideoConcatenatorTitle,
  renderVideoIteratorBody,
  renderVideoIteratorTitle,
  renderVideoDescriberBody,
  renderVideoDescriberTitle,
  renderVideoMaskByTextBody,
  renderVideoMaskByTextTitle,
  renderVideoToGifBody,
  renderVideoToGifTitle,
  renderRotateAndFlipBody,
  renderRotateAndFlipFooter,
  renderDepthAnythingV2Body,
  renderCompareBody,
  renderKlingElementBody,
  renderRunwayAleph2KeyframeBody,
  renderBlendBody,
} from "@/components/workflows/editor/nodes/blocks/tool/tool-shapes"

export type ToolSchema = {
  fields: WorkflowNodeFieldSchema[]
}

export type ToolRendererProps = {
  nodeId: string
  tool: ToolDefinition
  title?: string
  content?: string
  toolCategory?: string
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
  onContentChange?: (value: string) => void
  onContentCommit?: () => void
  onRunClick?: () => void
}

export type ToolRuntimeInputs = {
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

export type ToolRuntimeRunContext = {
  node: SharedWorkflowNode
  graph: SharedWorkflowGraph
  context: WorkflowRuntimeContext
  inputs: ToolRuntimeInputs
  outputPorts: SharedWorkflowNodePortData[]
}

export type ToolDefinition = {
  key: string
  group: string
  label: string
  menu: {
    category: string
    searchableText?: string
  }
  schema?: ToolSchema
  createData: () => WorkflowNodeData
  renderer: {
    width?: string
    className?: string
    renderTitle?: (props: ToolRendererProps) => React.ReactNode
    renderHeaderActions?: (props: ToolRendererProps) => React.ReactNode
    renderBody: (props: ToolRendererProps) => React.ReactNode
    renderFooter?: (props: ToolRendererProps) => React.ReactNode
    getPortOffset?: (index: number) => number
  }
  runtime?: {
    run: (context: ToolRuntimeRunContext) => unknown
  }
}

export type ToolMenuCategory = {
  id: string
  label: string
  definitions: readonly ToolDefinition[]
}

const DEFAULT_TOOL_WIDTH = "w-[432px]"

const DEFAULT_TOOL_SCHEMA: ToolSchema = {
  fields: [
    {
      key: "title",
      label: "Title",
      input: "text",
      placeholder: "Tool title",
      rules: [
        {
          kind: "required",
          level: "warning",
          code: "node.tool.title.missing",
          message: "Tool node title is empty.",
        },
      ],
    },
    {
      key: "toolKey",
      label: "Tool Key",
      input: "text",
      placeholder: "rotate-and-flip",
    },
    {
      key: "toolCategory",
      label: "Category",
      input: "text",
      placeholder: "Editing",
    },
    {
      key: "runLabel",
      label: "Run Label",
      input: "text",
      placeholder: "Run Tool",
    },
    {
      key: "addInputLabel",
      label: "Add Input Label",
      input: "text",
      placeholder: "Add input",
    },
  ],
}

const PROMPT_INPUT_PORT: WorkflowNodePortData = {
  key: "prompt",
  label: "Prompt",
  side: "left",
  labelVisibility: "hover",
  portToneClassName: "border-[#d78cff] bg-[#1c1d26]",
  labelToneClassName: "text-[#d78cff]",
}

const TEXT_INPUT_PORT: WorkflowNodePortData = {
  key: "text",
  label: "Text",
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

const IMAGE_INPUT_PORT_2: WorkflowNodePortData = {
  key: "image-2",
  label: "Image 2",
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
  portToneClassName: "border-[#7dd3fc] bg-[#1c1d26]",
  labelToneClassName: "text-[#7dd3fc]",
}

const VIDEO_INPUT_PORT_2: WorkflowNodePortData = {
  key: "video-2",
  label: "Video 2",
  side: "left",
  labelVisibility: "hover",
  portToneClassName: "border-[#7dd3fc] bg-[#1c1d26]",
  labelToneClassName: "text-[#7dd3fc]",
}

const AUDIO_INPUT_PORT: WorkflowNodePortData = {
  key: "audio",
  label: "Audio",
  side: "left",
  labelVisibility: "hover",
  portToneClassName: "border-[#f9a8d4] bg-[#1c1d26]",
  labelToneClassName: "text-[#f9a8d4]",
}

const MASK_INPUT_PORT: WorkflowNodePortData = {
  key: "mask",
  label: "Mask",
  side: "left",
  labelVisibility: "hover",
  portToneClassName: "border-[#f5c56b] bg-[#1c1d26]",
  labelToneClassName: "text-[#f5c56b]",
}

const LIST_INPUT_PORT: WorkflowNodePortData = {
  key: "items",
  label: "Items",
  side: "left",
  labelVisibility: "hover",
  portToneClassName: "border-[#c4b5fd] bg-[#1c1d26]",
  labelToneClassName: "text-[#c4b5fd]",
}

const VALUE_INPUT_PORT: WorkflowNodePortData = {
  key: "input",
  label: "Input",
  side: "left",
  labelVisibility: "hover",
  portToneClassName: "border-white/30 bg-[#1c1d26]",
  labelToneClassName: "text-white/70",
}

const VALUE_INPUT_PORT_2: WorkflowNodePortData = {
  key: "input-2",
  label: "Input 2",
  side: "left",
  labelVisibility: "hover",
  portToneClassName: "border-white/30 bg-[#1c1d26]",
  labelToneClassName: "text-white/70",
}

const RESULT_OUTPUT_PORT: WorkflowNodePortData = {
  key: "result",
  label: "Result",
  side: "right",
  labelVisibility: "hover",
  portToneClassName: "border-[#6fe7d1] bg-[#1c1d26]",
  labelToneClassName: "text-[#6fe7d1]",
}

const IMAGE_OUTPUT_PORT: WorkflowNodePortData = {
  key: "image",
  label: "Image",
  side: "right",
  labelVisibility: "hover",
  portToneClassName: "border-[#6fe7d1] bg-[#1c1d26]",
  labelToneClassName: "text-[#6fe7d1]",
}

const VIDEO_OUTPUT_PORT: WorkflowNodePortData = {
  key: "video",
  label: "Video",
  side: "right",
  labelVisibility: "hover",
  portToneClassName: "border-[#7dd3fc] bg-[#1c1d26]",
  labelToneClassName: "text-[#7dd3fc]",
}

const TEXT_OUTPUT_PORT: WorkflowNodePortData = {
  key: "text",
  label: "Text",
  side: "right",
  labelVisibility: "hover",
  portToneClassName: "border-[#d78cff] bg-[#1c1d26]",
  labelToneClassName: "text-[#d78cff]",
}

const MASK_OUTPUT_PORT: WorkflowNodePortData = {
  key: "mask",
  label: "Mask",
  side: "right",
  labelVisibility: "hover",
  portToneClassName: "border-[#f5c56b] bg-[#1c1d26]",
  labelToneClassName: "text-[#f5c56b]",
}

const VALUE_OUTPUT_PORT: WorkflowNodePortData = {
  key: "value",
  label: "Value",
  side: "right",
  labelVisibility: "hover",
  portToneClassName: "border-white/30 bg-[#1c1d26]",
  labelToneClassName: "text-white/70",
}

const INDEX_OUTPUT_PORT: WorkflowNodePortData = {
  key: "index",
  label: "Index",
  side: "right",
  labelVisibility: "hover",
  portToneClassName: "border-[#c4b5fd] bg-[#1c1d26]",
  labelToneClassName: "text-[#c4b5fd]",
}

function clonePort(port: WorkflowNodePortData): WorkflowNodePortData {
  return { ...port }
}

function getSharedToolOutputPorts(node: SharedWorkflowNode) {
  const outputPorts = node.data?.outputPorts?.filter(
    (port) => port.side === "right"
  )

  return outputPorts && outputPorts.length > 0
    ? outputPorts
    : [
        {
          key: "result",
          label: "Result",
          side: "right" as const,
        },
      ]
}

function createDefaultToolRenderer(category: string) {
  return function renderBody(props: ToolRendererProps) {
    return (
      <div
        className={`relative flex min-h-36 w-full flex-col justify-between overflow-hidden rounded-md border border-white/6 bg-[#1f212b] p-4 ${
          props.isRunning
            ? "border-sky-400/25 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.14)]"
            : ""
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="text-[10px] font-semibold tracking-[0.18em] text-white/45 uppercase">
              {props.toolCategory || category}
            </div>
            <div className="text-sm font-medium text-white/92">
              {props.title || props.tool.label}
            </div>
          </div>
          <div className="rounded-md border border-white/8 bg-white/4 px-2 py-1 text-[10px] font-semibold tracking-[0.16em] text-white/65 uppercase">
            Tool
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-[11px] text-white/45">
          <span>{props.inputPorts.length} inputs</span>
          <span>{props.outputPorts.length} outputs</span>
        </div>

        {props.isRunning ? (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1),transparent_60%)]" />
        ) : null}
      </div>
    )
  }
}

function createDefaultToolRuntimeResult({
  node,
  inputs,
  outputPorts,
  toolKey,
  toolCategory,
}: {
  node: SharedWorkflowNode
  inputs: ToolRuntimeInputs
  outputPorts: SharedWorkflowNodePortData[]
  toolKey: string
  toolCategory: string
}): WorkflowNodeRunResult {
  const output = {
    kind: "tool",
    nodeId: node.id,
    title: node.data?.title ?? "Tool",
    toolKey,
    toolCategory,
    inputs: inputs.inputsByTargetPort,
    connections: inputs.connections,
    result: `mock://tool/${toolKey}/${node.id}`,
  }

  const outputs = outputPorts.reduce<Record<string, unknown>>(
    (result, port) => {
      result[port.key] = {
        kind: "tool-result",
        nodeId: node.id,
        toolKey,
        toolCategory,
        portKey: port.key,
        label: port.label,
        value:
          port.key === "result"
            ? output.result
            : `mock://tool/${toolKey}/${node.id}/${port.key}`,
        inputs: inputs.inputsByTargetPort,
      }
      return result
    },
    {}
  )

  return {
    output,
    outputs: {
      default: output,
      ports: outputs,
    },
  }
}

function createStandardToolDefinition({
  key,
  group,
  label,
  category,
  searchableText,
  inputPorts = [],
  outputPorts = [],
  addInputLabel,
  runLabel = "Run Tool",
  showAddInputAction = false,
  showRunAction = true,
  schema = DEFAULT_TOOL_SCHEMA,
  width = DEFAULT_TOOL_WIDTH,
  className,
  getPortOffset = getNodePortOffset,
  renderTitle,
  renderHeaderActions,
  renderBody,
  renderFooter,
}: {
  key: string
  group: string
  label: string
  category: string
  searchableText?: string
  inputPorts?: readonly WorkflowNodePortData[]
  outputPorts?: readonly WorkflowNodePortData[]
  addInputLabel?: string
  runLabel?: string
  showAddInputAction?: boolean
  showRunAction?: boolean
  schema?: ToolSchema
  width?: string
  className?: string
  getPortOffset?: (index: number) => number
  renderTitle?: (props: ToolRendererProps) => React.ReactNode
  renderHeaderActions?: (props: ToolRendererProps) => React.ReactNode
  renderBody?: (props: ToolRendererProps) => React.ReactNode
  renderFooter?: (props: ToolRendererProps) => React.ReactNode
}): ToolDefinition {
  return {
    key,
    group,
    label,
    menu: {
      category,
      searchableText,
    },
    schema,
    createData: () => ({
      title: label,
      toolKey: key,
      toolCategory: category,
      inputPorts: inputPorts.map(clonePort),
      outputPorts: outputPorts.map(clonePort),
      addInputLabel,
      runLabel,
      showAddInputAction,
      showRunAction,
    }),
    renderer: {
      width,
      className,
      renderTitle,
      renderHeaderActions,
      renderBody: renderBody ?? createDefaultToolRenderer(category),
      renderFooter,
      getPortOffset,
    },
    runtime: {
      run({ node, inputs, outputPorts }) {
        return createDefaultToolRuntimeResult({
          node,
          inputs,
          outputPorts,
          toolKey: key,
          toolCategory: category,
        })
      },
    },
  }
}

export const TOOL_DEFINITIONS: readonly ToolDefinition[] = [
  createStandardToolDefinition({
    key: "rotate-and-flip",
    group: "editing",
    label: "Rotate and flip",
    category: "Editing",
    inputPorts: [{ ...IMAGE_INPUT_PORT, label: "Input*" }],
    outputPorts: [{ ...RESULT_OUTPUT_PORT, label: "Result" }],
    getPortOffset: getNodePortOffset,
    renderBody: renderRotateAndFlipBody,
    renderFooter: renderRotateAndFlipFooter,
  }),
  createStandardToolDefinition({
    key: "color-palette",
    group: "editing",
    label: "Color palette",
    category: "Editing",
    inputPorts: [],
    outputPorts: [
      { ...IMAGE_OUTPUT_PORT, label: "Image" },
      { ...TEXT_OUTPUT_PORT, label: "Text" },
    ],
    getPortOffset: (index) => getNodePortOffset(index, { step: 72 }),
    renderBody: renderColorPaletteBody,
    renderFooter: () => <></>,
    showRunAction: false,
  }),
  createStandardToolDefinition({
    key: "color-correction",
    group: "editing",
    label: "Color correction",
    category: "Editing",
    inputPorts: [{ ...IMAGE_INPUT_PORT, label: "File*" }],
    outputPorts: [{ ...RESULT_OUTPUT_PORT, label: "Result" }],
    getPortOffset: getNodePortOffset,
    renderBody: renderColorCorrectionBody,
    renderFooter: renderColorCorrectionFooter,
    showRunAction: false,
  }),
  createStandardToolDefinition({
    key: "levels",
    group: "editing",
    label: "Levels",
    category: "Editing",
    inputPorts: [{ ...IMAGE_INPUT_PORT, label: "Input*" }],
    outputPorts: [{ ...IMAGE_OUTPUT_PORT, label: "Output" }],
    getPortOffset: getNodePortOffset,
    renderBody: renderLevelsBody,
    renderFooter: renderLevelsFooter,
    showRunAction: false,
  }),
  createStandardToolDefinition({
    key: "compositor",
    group: "editing",
    label: "Compositor",
    category: "Editing",
    inputPorts: [
      { ...IMAGE_INPUT_PORT, label: "Background" },
      { ...IMAGE_INPUT_PORT_2, label: "Layer 1" },
    ],
    outputPorts: [{ ...IMAGE_OUTPUT_PORT, label: "Output" }],
    getPortOffset: (index) => getNodePortOffset(index, { step: 66 }),
    renderBody: renderCompositorBody,
    renderFooter: renderCompositorFooter,
    showRunAction: false,
    showAddInputAction: false,
  }),
  createStandardToolDefinition({
    key: "painter",
    group: "editing",
    label: "Painter",
    category: "Editing",
    inputPorts: [{ ...IMAGE_INPUT_PORT, label: "Image" }],
    outputPorts: [
      { ...RESULT_OUTPUT_PORT, label: "Result" },
      { ...MASK_OUTPUT_PORT, label: "Mask" },
    ],
    getPortOffset: (index) => getNodePortOffset(index, { step: 72 }),
    renderTitle: renderPainterTitle,
    renderBody: renderPainterBody,
    renderFooter: () => <></>,
  }),
  createStandardToolDefinition({
    key: "crop",
    group: "editing",
    label: "Crop",
    category: "Editing",
    inputPorts: [{ ...IMAGE_INPUT_PORT, label: "Input*" }],
    outputPorts: [{ ...IMAGE_OUTPUT_PORT, label: "Output" }],
    renderBody: renderCropBody,
    renderFooter: () => <></>,
    showRunAction: false,
  }),
  createStandardToolDefinition({
    key: "resize",
    group: "editing",
    label: "Resize",
    category: "Editing",
    inputPorts: [{ ...IMAGE_INPUT_PORT, label: "Input*" }],
    outputPorts: [{ ...IMAGE_OUTPUT_PORT, label: "Output" }],
    renderBody: renderResizeBody,
    renderFooter: () => <></>,
    showRunAction: false,
  }),
  createStandardToolDefinition({
    key: "blur",
    group: "editing",
    label: "Blur",
    category: "Editing",
    inputPorts: [{ ...IMAGE_INPUT_PORT, label: "Input*" }],
    outputPorts: [{ ...IMAGE_OUTPUT_PORT, label: "Output" }],
    renderBody: renderBlurBody,
    renderFooter: () => <></>,
    showRunAction: false,
  }),
  createStandardToolDefinition({
    key: "invert",
    group: "editing",
    label: "Invert",
    category: "Editing",
    inputPorts: [{ ...IMAGE_INPUT_PORT, label: "Input" }],
    outputPorts: [{ ...IMAGE_OUTPUT_PORT, label: "Output" }],
    renderBody: renderInvertBody,
    renderFooter: () => <></>,
    showRunAction: false,
  }),
  createStandardToolDefinition({
    key: "channels",
    group: "editing",
    label: "Channels",
    category: "Editing",
    inputPorts: [{ ...IMAGE_INPUT_PORT, label: "Input" }],
    outputPorts: [{ ...IMAGE_OUTPUT_PORT, label: "Output" }],
    renderBody: renderChannelsBody,
    renderFooter: () => <></>,
    showRunAction: false,
  }),
  createStandardToolDefinition({
    key: "extract-video-frame",
    group: "editing",
    label: "Extract Video Frame",
    category: "Editing",
    searchableText: "video frame image",
    inputPorts: [{ ...VIDEO_INPUT_PORT, label: "Video" }],
    outputPorts: [{ ...IMAGE_OUTPUT_PORT, label: "Frame" }],
    renderBody: renderExtractVideoFrameBody,
    renderFooter: () => <></>,
    showRunAction: false,
  }),
  createStandardToolDefinition({
    key: "video-concatenator",
    group: "editing",
    label: "Video Concatenator",
    category: "Editing",
    searchableText: "merge combine video",
    inputPorts: [
      {
        ...VIDEO_INPUT_PORT,
        label: "Video 1",
        portToneClassName: "border-[#f19a9a] bg-[#1c1d26]",
        labelToneClassName: "text-[#f19a9a]",
      },
      {
        ...VIDEO_INPUT_PORT_2,
        label: "Video 2",
        portToneClassName: "border-[#f19a9a] bg-[#1c1d26]",
        labelToneClassName: "text-[#f19a9a]",
      },
    ],
    outputPorts: [
      {
        ...VIDEO_OUTPUT_PORT,
        label: "Video",
        portToneClassName: "border-[#72e6cf] bg-[#1c1d26]",
        labelToneClassName: "text-[#72e6cf]",
      },
    ],
    addInputLabel: "Add another video input",
    runLabel: "Run Model",
    showAddInputAction: true,
    renderTitle: renderVideoConcatenatorTitle,
    renderBody: renderVideoConcatenatorBody,
  }),
  createStandardToolDefinition({
    key: "video-to-gif",
    group: "editing",
    label: "Video to GIF",
    category: "Editing",
    searchableText: "gif convert video",
    inputPorts: [
      {
        ...VIDEO_INPUT_PORT,
        label: "Video*",
        portToneClassName: "border-[#f19a9a] bg-[#1c1d26]",
        labelToneClassName: "text-[#f19a9a]",
      },
    ],
    outputPorts: [
      {
        ...VIDEO_OUTPUT_PORT,
        key: "gif",
        label: "GIF",
        portToneClassName: "border-[#72e6cf] bg-[#1c1d26]",
        labelToneClassName: "text-[#72e6cf]",
      },
    ],
    runLabel: "Run Model",
    showRunAction: true,
    renderTitle: renderVideoToGifTitle,
    renderBody: renderVideoToGifBody,
  }),
  createStandardToolDefinition({
    key: "mask-extractor",
    group: "matte",
    label: "Masks Extractor",
    category: "Matte",
    inputPorts: [{ ...IMAGE_INPUT_PORT, label: "Image" }],
    outputPorts: [
      {
        ...IMAGE_OUTPUT_PORT,
        key: "image-with-alpha",
        label: "Image With Alpha",
      },
      { ...MASK_OUTPUT_PORT, label: "Mask" },
    ],
    renderBody: renderMaskExtractorBody,
    renderFooter: renderMaskExtractorFooter,
    showRunAction: false,
  }),
  createStandardToolDefinition({
    key: "mask-by-text",
    group: "matte",
    label: "Mask by Text",
    category: "Matte",
    searchableText: "segment text prompt mask",
    inputPorts: [
      { ...IMAGE_INPUT_PORT, label: "Image*" },
      { ...PROMPT_INPUT_PORT, label: "Prompt*" },
    ],
    outputPorts: [{ ...MASK_OUTPUT_PORT, label: "Mask" }],
    runLabel: "Run Model",
    showRunAction: true,
    renderTitle: renderMaskByTextTitle,
    renderBody: renderMaskByTextBody,
  }),
  createStandardToolDefinition({
    key: "matte-grow-shrink",
    group: "matte",
    label: "Matte Grow / Shrink",
    category: "Matte",
    inputPorts: [{ ...MASK_INPUT_PORT, label: "Input*" }],
    outputPorts: [{ ...MASK_OUTPUT_PORT, label: "Output" }],
    renderTitle: renderMatteGrowShrinkTitle,
    renderBody: renderMatteGrowShrinkBody,
    renderFooter: () => <></>,
    showRunAction: false,
  }),
  createStandardToolDefinition({
    key: "merge-alpha",
    group: "matte",
    label: "Merge Alpha",
    category: "Matte",
    inputPorts: [
      { ...IMAGE_INPUT_PORT, label: "Input*" },
      { ...MASK_INPUT_PORT, label: "Alpha Input*" },
    ],
    outputPorts: [{ ...IMAGE_OUTPUT_PORT, label: "Output" }],
    renderBody: renderMergeAlphaBody,
    renderFooter: () => <></>,
    showRunAction: false,
  }),
  createStandardToolDefinition({
    key: "video-matte",
    group: "matte",
    label: "Extract Video Matte",
    category: "Matte",
    inputPorts: [{ ...VIDEO_INPUT_PORT, label: "Video*" }],
    outputPorts: [{ ...VIDEO_OUTPUT_PORT, label: "Video" }],
    renderTitle: renderExtractVideoMatteTitle,
    renderBody: renderExtractVideoMatteBody,
  }),
  createStandardToolDefinition({
    key: "video-mask-by-text",
    group: "matte",
    label: "Video Mask by Text",
    category: "Matte",
    searchableText: "video segment prompt mask",
    inputPorts: [
      { ...VIDEO_INPUT_PORT, label: "Video*" },
      { ...PROMPT_INPUT_PORT, label: "Prompt*" },
    ],
    outputPorts: [{ ...MASK_OUTPUT_PORT, label: "Mask" }],
    runLabel: "Run Model",
    showRunAction: true,
    renderTitle: renderVideoMaskByTextTitle,
    renderBody: renderVideoMaskByTextBody,
  }),
  createStandardToolDefinition({
    key: "prompt",
    group: "text-tools",
    label: "Prompt",
    category: "Text tools",
    searchableText: "text prompt composer",
    outputPorts: [{ ...TEXT_OUTPUT_PORT, key: "prompt", label: "Prompt" }],
    addInputLabel: "Add variable",
    showAddInputAction: true,
    showRunAction: false,
    renderBody: renderPromptBody,
    renderFooter: renderPromptFooter,
  }),
  createStandardToolDefinition({
    key: "prompt-concatenator",
    group: "text-tools",
    label: "Prompt Concatenator",
    category: "Text tools",
    searchableText: "merge prompt text",
    inputPorts: [
      { ...TEXT_INPUT_PORT, key: "prompt-1", label: "Prompt 1" },
      { ...TEXT_INPUT_PORT, key: "prompt-2", label: "Prompt 2" },
    ],
    outputPorts: [
      { ...TEXT_OUTPUT_PORT, key: "combined-prompt", label: "Combined Prompt" },
    ],
    addInputLabel: "Add text input",
    showAddInputAction: true,
    showRunAction: false,
    renderBody: renderPromptConcatenatorBody,
  }),
  createStandardToolDefinition({
    key: "prompt-enhancer",
    group: "text-tools",
    label: "Prompt Enhancer",
    category: "Text tools",
    searchableText: "rewrite improve prompt",
    inputPorts: [{ ...TEXT_INPUT_PORT, key: "prompt", label: "Prompt*" }],
    outputPorts: [
      { ...TEXT_OUTPUT_PORT, key: "enhanced-prompt", label: "Enhanced Prompt" },
    ],
    addInputLabel: "Add another image input",
    runLabel: "Run Model",
    showAddInputAction: true,
    showRunAction: true,
    renderBody: renderPromptEnhancerBody,
  }),
  createStandardToolDefinition({
    key: "run-any-llm",
    group: "text-tools",
    label: "Any LLM",
    category: "Text tools",
    searchableText: "llm chat text generation",
    inputPorts: [
      { ...PROMPT_INPUT_PORT, label: "Prompt*" },
      { ...PROMPT_INPUT_PORT, key: "system-prompt", label: "System Prompt" },
      { ...IMAGE_INPUT_PORT, key: "image-1", label: "Image 1" },
    ],
    outputPorts: [{ ...TEXT_OUTPUT_PORT, key: "text", label: "Text" }],
    addInputLabel: "Add another image input",
    runLabel: "Run Model",
    showAddInputAction: true,
    showRunAction: true,
    renderBody: renderAnyLlmBody,
  }),
  createStandardToolDefinition({
    key: "image-describer",
    group: "text-tools",
    label: "Image Describer",
    category: "Text tools",
    searchableText: "caption image to text",
    inputPorts: [{ ...IMAGE_INPUT_PORT, key: "image-1", label: "Image*" }],
    outputPorts: [{ ...TEXT_OUTPUT_PORT, key: "text", label: "Text" }],
    addInputLabel: "Add another image input",
    runLabel: "Run Model",
    showAddInputAction: true,
    showRunAction: true,
    renderBody: renderImageDescriberBody,
  }),
  createStandardToolDefinition({
    key: "video-describer",
    group: "text-tools",
    label: "Video Describer",
    category: "Text tools",
    searchableText: "caption video to text",
    inputPorts: [{ ...VIDEO_INPUT_PORT, key: "video-1", label: "Video*" }],
    outputPorts: [{ ...TEXT_OUTPUT_PORT, key: "text", label: "Text" }],
    addInputLabel: "Add another video input",
    runLabel: "Run Model",
    showAddInputAction: true,
    showRunAction: true,
    renderTitle: renderVideoDescriberTitle,
    renderBody: renderVideoDescriberBody,
  }),
  createStandardToolDefinition({
    key: "audio-describer",
    group: "text-tools",
    label: "Audio Describer",
    category: "Text tools",
    searchableText: "transcribe audio speech text",
    inputPorts: [{ ...AUDIO_INPUT_PORT, key: "audio", label: "Audio*" }],
    outputPorts: [{ ...TEXT_OUTPUT_PORT, key: "text", label: "Text" }],
    runLabel: "Run Model",
    showAddInputAction: false,
    showRunAction: true,
    renderTitle: renderAudioDescriberTitle,
    renderBody: renderAudioDescriberBody,
  }),
  createStandardToolDefinition({
    key: "text-iterator",
    group: "iterators",
    label: "Text Iterator",
    category: "Iterators",
    inputPorts: [
      {
        ...LIST_INPUT_PORT,
        key: "text-or-array",
        label: "Text Or Array",
        portToneClassName: "border-white/70 bg-[#1c1d26]",
        labelToneClassName: "text-white/92",
      },
    ],
    outputPorts: [{ ...TEXT_OUTPUT_PORT, key: "text", label: "Text" }],
    showAddInputAction: false,
    showRunAction: false,
    getPortOffset: () => 61,
    renderTitle: renderTextIteratorTitle,
    renderHeaderActions: renderTextIteratorHeaderActions,
    renderBody: renderTextIteratorBody,
    renderFooter: renderTextIteratorFooter,
  }),
  createStandardToolDefinition({
    key: "image-iterator",
    group: "iterators",
    label: "Image Iterator",
    category: "Iterators",
    inputPorts: [],
    outputPorts: [
      {
        ...RESULT_OUTPUT_PORT,
        key: "file",
        label: "File",
        portToneClassName: "border-[#7ef0d7] bg-[#1c1d26]",
        labelToneClassName: "text-[#7ef0d7]",
      },
    ],
    showAddInputAction: false,
    showRunAction: false,
    renderTitle: renderImageIteratorTitle,
    renderBody: renderImageIteratorBody,
    renderFooter: () => <></>,
  }),
  createStandardToolDefinition({
    key: "video-iterator",
    group: "iterators",
    label: "Video Iterator",
    category: "Iterators",
    inputPorts: [],
    outputPorts: [
      {
        ...RESULT_OUTPUT_PORT,
        key: "file",
        label: "File",
        portToneClassName: "border-[#f19a9a] bg-[#1c1d26]",
        labelToneClassName: "text-[#f19a9a]",
      },
    ],
    showAddInputAction: false,
    showRunAction: false,
    renderTitle: renderVideoIteratorTitle,
    renderBody: renderVideoIteratorBody,
    renderFooter: () => <></>,
  }),
  createStandardToolDefinition({
    key: "helper-import",
    group: "helpers",
    label: "Import",
    category: "Helpers",
    searchableText: "file input import",
    outputPorts: [
      {
        ...RESULT_OUTPUT_PORT,
        key: "file",
        label: "File",
        portToneClassName: "border-white/70 bg-[#1c1d26]",
        labelToneClassName: "text-white/92",
      },
    ],
    showRunAction: false,
    getPortOffset: getNodePortOffset,
    renderBody: renderImportBody,
    renderFooter: () => <></>,
  }),
  createStandardToolDefinition({
    key: "helper-export",
    group: "helpers",
    label: "Export",
    category: "Helpers",
    searchableText: "file output export",
    inputPorts: [
      {
        ...VALUE_INPUT_PORT,
        key: "input",
        label: "Input",
        portToneClassName: "border-white/70 bg-[#1c1d26]",
        labelToneClassName: "text-white/92",
      },
    ],
    showRunAction: false,
    getPortOffset: () => 59,
    renderBody: renderExportBody,
    renderFooter: () => <></>,
  }),
  createStandardToolDefinition({
    key: "helper-preview",
    group: "helpers",
    label: "Preview",
    category: "Helpers",
    searchableText: "view inspect preview",
    inputPorts: [
      {
        ...VALUE_INPUT_PORT,
        key: "file",
        label: "File",
        portToneClassName: "border-white/70 bg-[#1c1d26]",
        labelToneClassName: "text-white/92",
      },
    ],
    showRunAction: false,
    getPortOffset: getNodePortOffset,
    renderBody: renderPreviewBody,
    renderFooter: () => <></>,
  }),
  createStandardToolDefinition({
    key: "helper-import-lora",
    group: "helpers",
    label: "Import LoRA",
    category: "Helpers",
    searchableText: "lora import upload url model",
    outputPorts: [
      {
        ...VALUE_OUTPUT_PORT,
        key: "lora-url",
        label: "LoRA_URL",
        portToneClassName: "border-[#b66cff] bg-[#1c1d26]",
        labelToneClassName: "text-[#b66cff]",
      },
    ],
    showRunAction: false,
    getPortOffset: () => 101,
    renderBody: renderImportLoraBody,
    renderFooter: () => <></>,
  }),
  createStandardToolDefinition({
    key: "helper-import-multiple-loras",
    group: "helpers",
    label: "Import Multiple LoRAs",
    category: "Helpers",
    searchableText: "lora import multiple weight url model",
    outputPorts: [
      {
        ...VALUE_OUTPUT_PORT,
        key: "lora-url",
        label: "LoRA_URL",
        portToneClassName: "border-[#b66cff] bg-[#1c1d26]",
        labelToneClassName: "text-[#b66cff]",
      },
      {
        ...INDEX_OUTPUT_PORT,
        key: "weight",
        label: "Weight",
        portToneClassName: "border-[#c9f7bf] bg-[#1c1d26]",
        labelToneClassName: "text-[#c9f7bf]",
      },
    ],
    showRunAction: false,
    getPortOffset: (index) => (index === 0 ? 85 : 170),
    renderBody: renderImportMultipleLorasBody,
    renderFooter: () => <></>,
  }),
  createStandardToolDefinition({
    key: "router",
    group: "helpers",
    label: "Router",
    category: "Helpers",
    searchableText: "branch switch route",
    inputPorts: [VALUE_INPUT_PORT],
    outputPorts: [
      {
        ...VALUE_OUTPUT_PORT,
        key: "output",
        label: "Output",
        portToneClassName: "border-white/80 bg-[#1c1d26]",
        labelToneClassName: "text-white/92",
      },
    ],
    showAddInputAction: false,
    showRunAction: false,
    getPortOffset: () => 33,
    renderTitle: renderRouterTitle,
    renderBody: () => null,
    renderFooter: () => <></>,
    width: "w-[300px]",
    className: "rounded-md",
  }),
  createStandardToolDefinition({
    key: "output",
    group: "helpers",
    label: "Output",
    category: "Helpers",
    inputPorts: [
      {
        ...VALUE_INPUT_PORT,
        key: "workflow",
        label: "Workflow*",
        portToneClassName: "border-white/80 bg-[#1c1d26]",
        labelToneClassName: "text-white/92",
      },
    ],
    showAddInputAction: false,
    showRunAction: false,
    getPortOffset: () => 33,
    renderTitle: renderOutputTitle,
    renderBody: () => null,
    renderFooter: () => <></>,
    width: "w-[300px]",
    className: "rounded-md",
  }),
  createStandardToolDefinition({
    key: "depth-anything-v2",
    group: "helpers",
    label: "Depth Anything V2",
    category: "Helpers",
    searchableText: "depth map image",
    inputPorts: [{ ...IMAGE_INPUT_PORT, label: "Image*" }],
    outputPorts: [{ ...IMAGE_OUTPUT_PORT, label: "Depth Map" }],
    runLabel: "Run Model",
    showRunAction: true,
    renderBody: renderDepthAnythingV2Body,
  }),
  createStandardToolDefinition({
    key: "compare",
    group: "helpers",
    label: "Compare",
    category: "Helpers",
    searchableText: "diff compare values",
    inputPorts: [
      { ...VALUE_INPUT_PORT, label: "Input 1" },
      { ...VALUE_INPUT_PORT_2, label: "Input 2" },
    ],
    outputPorts: [
      { ...VALUE_OUTPUT_PORT, key: "output-1", label: "Output 1" },
      { ...VALUE_OUTPUT_PORT, key: "output-2", label: "Output 2" },
    ],
    showRunAction: false,
    getPortOffset: getNodePortOffset,
    renderBody: renderCompareBody,
    renderFooter: () => <></>,
  }),
  createStandardToolDefinition({
    key: "kling-element",
    group: "helpers",
    label: "Kling Element",
    category: "Helpers",
    searchableText: "kling element 3d model",
    inputPorts: [
      { ...IMAGE_INPUT_PORT, key: "frontal-image", label: "Frontal Image*" },
      {
        ...IMAGE_INPUT_PORT_2,
        key: "reference-image-1",
        label: "Reference Image 1*",
      },
      {
        ...IMAGE_INPUT_PORT,
        key: "reference-image-2",
        label: "Reference Image 2",
      },
      {
        ...IMAGE_INPUT_PORT,
        key: "reference-image-3",
        label: "Reference Image 3",
      },
    ],
    outputPorts: [
      {
        key: "kling-element",
        label: "Kling Element",
        side: "right",
        labelVisibility: "hover",
        portToneClassName: "border-[#f59e0b] bg-[#1c1d26]",
        labelToneClassName: "text-[#f59e0b]",
      },
    ],
    runLabel: "Generate",
    showRunAction: false,
    getPortOffset: (index) => getNodePortOffset(index, { step: 58 }),
    renderBody: renderKlingElementBody,
    renderFooter: () => <></>,
  }),
  createStandardToolDefinition({
    key: "runway-aleph-2-keyframe",
    group: "helpers",
    label: "Runway Aleph 2 Keyframe",
    category: "Helpers",
    searchableText: "keyframe runway video",
    inputPorts: [{ ...IMAGE_INPUT_PORT, label: "Image*" }],
    outputPorts: [
      {
        key: "aleph-2-keyframe",
        label: "Aleph 2 Keyframe",
        side: "right",
        labelVisibility: "hover",
        portToneClassName: "border-[#f59e0b] bg-[#1c1d26]",
        labelToneClassName: "text-[#f59e0b]",
      },
    ],
    showRunAction: false,
    renderBody: renderRunwayAleph2KeyframeBody,
    renderFooter: () => <></>,
  }),
  createStandardToolDefinition({
    key: "blend",
    group: "helpers",
    label: "Blend",
    category: "Helpers",
    searchableText: "blend composite mix images",
    inputPorts: [
      {
        key: "back",
        label: "Back",
        side: "left",
        labelVisibility: "hover",
        portToneClassName: "border-white/30 bg-[#1c1d26]",
        labelToneClassName: "text-white/70",
      },
      {
        key: "front",
        label: "Front",
        side: "left",
        labelVisibility: "hover",
        portToneClassName: "border-white/30 bg-[#1c1d26]",
        labelToneClassName: "text-white/70",
      },
    ],
    outputPorts: [
      {
        key: "result",
        label: "Result",
        side: "right",
        labelVisibility: "hover",
        portToneClassName: "border-white/30 bg-[#1c1d26]",
        labelToneClassName: "text-white/70",
      },
    ],
    showRunAction: false,
    getPortOffset: getNodePortOffset,
    renderBody: renderBlendBody,
    renderFooter: () => <></>,
  }),
  createStandardToolDefinition({
    key: "number",
    group: "datatypes",
    label: "Number",
    category: "Datatypes",
    searchableText: "numeric scalar value",
    outputPorts: [VALUE_OUTPUT_PORT],
    runLabel: "Set Value",
    showRunAction: false,
  }),
  createStandardToolDefinition({
    key: "text",
    group: "datatypes",
    label: "Text",
    category: "Datatypes",
    searchableText: "string text value",
    outputPorts: [TEXT_OUTPUT_PORT],
    runLabel: "Set Value",
    showRunAction: false,
  }),
  createStandardToolDefinition({
    key: "toggle",
    group: "datatypes",
    label: "Toggle",
    category: "Datatypes",
    searchableText: "boolean switch value",
    outputPorts: [VALUE_OUTPUT_PORT],
    runLabel: "Set Value",
    showRunAction: false,
  }),
  createStandardToolDefinition({
    key: "list-selector",
    group: "datatypes",
    label: "List Selector",
    category: "Datatypes",
    searchableText: "select pick array list",
    inputPorts: [LIST_INPUT_PORT],
    outputPorts: [VALUE_OUTPUT_PORT],
    showRunAction: false,
  }),
  createStandardToolDefinition({
    key: "seed",
    group: "datatypes",
    label: "Seed",
    category: "Datatypes",
    searchableText: "random seed value",
    outputPorts: [VALUE_OUTPUT_PORT],
    runLabel: "Set Seed",
    showRunAction: false,
  }),
  createStandardToolDefinition({
    key: "array",
    group: "datatypes",
    label: "Array",
    category: "Datatypes",
    searchableText: "list array collection",
    inputPorts: [VALUE_INPUT_PORT],
    outputPorts: [VALUE_OUTPUT_PORT],
    addInputLabel: "Add item",
    showAddInputAction: true,
    showRunAction: false,
  }),
] as const

export const TOOL_MENU_CATEGORIES: readonly ToolMenuCategory[] = Array.from(
  TOOL_DEFINITIONS.reduce<Map<string, ToolMenuCategory>>(
    (result, definition) => {
      const category = result.get(definition.group)
      if (category) {
        result.set(definition.group, {
          ...category,
          definitions: [...category.definitions, definition],
        })
        return result
      }

      result.set(definition.group, {
        id: definition.group,
        label: definition.menu.category,
        definitions: [definition],
      })
      return result
    },
    new Map()
  ).values()
)

export function getToolDefinition(toolKey?: string | null) {
  if (!toolKey) {
    return undefined
  }

  return TOOL_DEFINITIONS.find((definition) => definition.key === toolKey)
}

export function getDefaultToolDefinition() {
  return TOOL_DEFINITIONS[0]
}

export function getToolSchema(toolKey?: string | null) {
  return getToolDefinition(toolKey)?.schema
}

export function getToolPortOffset(toolKey: string | undefined, index: number) {
  return (
    getToolDefinition(toolKey)?.renderer.getPortOffset?.(index) ??
    getNodePortOffset(index)
  )
}

export function createToolNodeData(definition: ToolDefinition) {
  return definition.createData()
}

export function getToolRuntimeOutputPorts(node: SharedWorkflowNode) {
  return getSharedToolOutputPorts(node)
}

export function normalizeToolRuntimeResult(
  result: unknown,
  context: ToolRuntimeRunContext,
  definition: ToolDefinition
): WorkflowNodeRunResult {
  if (
    result &&
    typeof result === "object" &&
    ("output" in result || "outputs" in result)
  ) {
    return result as WorkflowNodeRunResult
  }

  const defaultOutput = createDefaultToolRuntimeResult({
    node: context.node,
    inputs: context.inputs,
    outputPorts: context.outputPorts,
    toolKey: definition.key,
    toolCategory: definition.menu.category,
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
