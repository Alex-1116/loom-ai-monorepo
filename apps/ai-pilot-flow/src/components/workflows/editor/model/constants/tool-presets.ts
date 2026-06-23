import type {
  WorkflowNodeData,
  WorkflowNodePortData,
} from "@/components/workflows/editor/model/types/workflow-node"

type ToolCategoryId =
  | "editing"
  | "matte"
  | "text-tools"
  | "iterators"
  | "helpers"
  | "datatypes"

export type ToolPreset = {
  id: string
  label: string
  toolKey: string
  inputPorts?: readonly WorkflowNodePortData[]
  outputPorts?: readonly WorkflowNodePortData[]
  addInputLabel?: string
  runLabel?: string
  showAddInputAction?: boolean
  showRunAction?: boolean
}

export type ToolMenuCategory = {
  id: ToolCategoryId
  label: string
  presets: readonly ToolPreset[]
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

const ROUTE_TRUE_OUTPUT_PORT: WorkflowNodePortData = {
  key: "route-a",
  label: "Route A",
  side: "right",
  labelVisibility: "hover",
  portToneClassName: "border-[#6fe7d1] bg-[#1c1d26]",
  labelToneClassName: "text-[#6fe7d1]",
}

const ROUTE_FALSE_OUTPUT_PORT: WorkflowNodePortData = {
  key: "route-b",
  label: "Route B",
  side: "right",
  labelVisibility: "hover",
  portToneClassName: "border-[#f5c56b] bg-[#1c1d26]",
  labelToneClassName: "text-[#f5c56b]",
}

export const TOOL_MENU_CATEGORIES: readonly ToolMenuCategory[] = [
  {
    id: "editing",
    label: "Editing",
    presets: [
      {
        id: "rotate-and-flip",
        label: "Rotate and flip",
        toolKey: "rotate-and-flip",
        inputPorts: [IMAGE_INPUT_PORT],
        outputPorts: [IMAGE_OUTPUT_PORT],
      },
      {
        id: "color-palette",
        label: "Color palette",
        toolKey: "color-palette",
        inputPorts: [IMAGE_INPUT_PORT],
        outputPorts: [IMAGE_OUTPUT_PORT],
      },
      {
        id: "color-correction",
        label: "Color correction",
        toolKey: "color-correction",
        inputPorts: [IMAGE_INPUT_PORT],
        outputPorts: [IMAGE_OUTPUT_PORT],
      },
      {
        id: "levels",
        label: "Levels",
        toolKey: "levels",
        inputPorts: [IMAGE_INPUT_PORT],
        outputPorts: [IMAGE_OUTPUT_PORT],
      },
      {
        id: "compositor",
        label: "Compositor",
        toolKey: "compositor",
        inputPorts: [IMAGE_INPUT_PORT, IMAGE_INPUT_PORT_2],
        outputPorts: [IMAGE_OUTPUT_PORT],
      },
      {
        id: "painter",
        label: "Painter",
        toolKey: "painter",
        inputPorts: [IMAGE_INPUT_PORT],
        outputPorts: [IMAGE_OUTPUT_PORT],
      },
      {
        id: "crop",
        label: "Crop",
        toolKey: "crop",
        inputPorts: [IMAGE_INPUT_PORT],
        outputPorts: [IMAGE_OUTPUT_PORT],
      },
      {
        id: "resize",
        label: "Resize",
        toolKey: "resize",
        inputPorts: [IMAGE_INPUT_PORT],
        outputPorts: [IMAGE_OUTPUT_PORT],
      },
      {
        id: "blur",
        label: "Blur",
        toolKey: "blur",
        inputPorts: [IMAGE_INPUT_PORT],
        outputPorts: [IMAGE_OUTPUT_PORT],
      },
      {
        id: "invert",
        label: "Invert",
        toolKey: "invert",
        inputPorts: [IMAGE_INPUT_PORT],
        outputPorts: [IMAGE_OUTPUT_PORT],
      },
      {
        id: "channels",
        label: "Channels",
        toolKey: "channels",
        inputPorts: [IMAGE_INPUT_PORT],
        outputPorts: [IMAGE_OUTPUT_PORT],
      },
      {
        id: "extract-video-frame",
        label: "Extract Video Frame",
        toolKey: "extract-video-frame",
        inputPorts: [VIDEO_INPUT_PORT],
        outputPorts: [IMAGE_OUTPUT_PORT],
      },
      {
        id: "video-concatenator",
        label: "Video Concatenator",
        toolKey: "video-concatenator",
        inputPorts: [VIDEO_INPUT_PORT, VIDEO_INPUT_PORT_2],
        outputPorts: [VIDEO_OUTPUT_PORT],
        addInputLabel: "Add video input",
        showAddInputAction: true,
      },
      {
        id: "video-to-gif",
        label: "Video to GIF",
        toolKey: "video-to-gif",
        inputPorts: [VIDEO_INPUT_PORT],
        outputPorts: [RESULT_OUTPUT_PORT],
      },
    ],
  },
  {
    id: "matte",
    label: "Matte",
    presets: [
      {
        id: "mask-extractor",
        label: "Mask Extractor",
        toolKey: "mask-extractor",
        inputPorts: [IMAGE_INPUT_PORT],
        outputPorts: [MASK_OUTPUT_PORT],
      },
      {
        id: "mask-by-text",
        label: "Mask by Text",
        toolKey: "mask-by-text",
        inputPorts: [PROMPT_INPUT_PORT, IMAGE_INPUT_PORT],
        outputPorts: [MASK_OUTPUT_PORT],
      },
      {
        id: "matte-grow-shrink",
        label: "Matte Grow / Shrink",
        toolKey: "matte-grow-shrink",
        inputPorts: [MASK_INPUT_PORT],
        outputPorts: [MASK_OUTPUT_PORT],
      },
      {
        id: "merge-alpha",
        label: "Merge Alpha",
        toolKey: "merge-alpha",
        inputPorts: [IMAGE_INPUT_PORT, MASK_INPUT_PORT],
        outputPorts: [IMAGE_OUTPUT_PORT],
      },
      {
        id: "video-matte",
        label: "Video Matte",
        toolKey: "video-matte",
        inputPorts: [VIDEO_INPUT_PORT],
        outputPorts: [MASK_OUTPUT_PORT],
      },
      {
        id: "video-mask-by-text",
        label: "Video Mask by Text",
        toolKey: "video-mask-by-text",
        inputPorts: [PROMPT_INPUT_PORT, VIDEO_INPUT_PORT],
        outputPorts: [MASK_OUTPUT_PORT],
      },
    ],
  },
  {
    id: "text-tools",
    label: "Text tools",
    presets: [
      {
        id: "prompt-tool",
        label: "Prompt",
        toolKey: "prompt-tool",
        outputPorts: [TEXT_OUTPUT_PORT],
        runLabel: "Compose",
      },
      {
        id: "prompt-concatenator",
        label: "Prompt Concatenator",
        toolKey: "prompt-concatenator",
        inputPorts: [
          TEXT_INPUT_PORT,
          { ...TEXT_INPUT_PORT, key: "text-2", label: "Text 2" },
        ],
        outputPorts: [TEXT_OUTPUT_PORT],
        addInputLabel: "Add text input",
        showAddInputAction: true,
      },
      {
        id: "prompt-enhancer",
        label: "Prompt Enhancer",
        toolKey: "prompt-enhancer",
        inputPorts: [TEXT_INPUT_PORT],
        outputPorts: [TEXT_OUTPUT_PORT],
      },
      {
        id: "run-any-llm",
        label: "Run Any LLM",
        toolKey: "run-any-llm",
        inputPorts: [PROMPT_INPUT_PORT],
        outputPorts: [TEXT_OUTPUT_PORT],
        runLabel: "Run LLM",
      },
      {
        id: "image-describer",
        label: "Image Describer",
        toolKey: "image-describer",
        inputPorts: [IMAGE_INPUT_PORT],
        outputPorts: [TEXT_OUTPUT_PORT],
      },
      {
        id: "video-describer",
        label: "Video Describer",
        toolKey: "video-describer",
        inputPorts: [VIDEO_INPUT_PORT],
        outputPorts: [TEXT_OUTPUT_PORT],
      },
      {
        id: "audio-describer",
        label: "Audio Describer",
        toolKey: "audio-describer",
        inputPorts: [AUDIO_INPUT_PORT],
        outputPorts: [TEXT_OUTPUT_PORT],
      },
    ],
  },
  {
    id: "iterators",
    label: "Iterators",
    presets: [
      {
        id: "text-iterator",
        label: "Text Iterator",
        toolKey: "text-iterator",
        inputPorts: [LIST_INPUT_PORT],
        outputPorts: [TEXT_OUTPUT_PORT, INDEX_OUTPUT_PORT],
      },
      {
        id: "image-iterator",
        label: "Image Iterator",
        toolKey: "image-iterator",
        inputPorts: [LIST_INPUT_PORT],
        outputPorts: [IMAGE_OUTPUT_PORT, INDEX_OUTPUT_PORT],
      },
      {
        id: "video-iterator",
        label: "Video Iterator",
        toolKey: "video-iterator",
        inputPorts: [LIST_INPUT_PORT],
        outputPorts: [VIDEO_OUTPUT_PORT, INDEX_OUTPUT_PORT],
      },
    ],
  },
  {
    id: "helpers",
    label: "Helpers",
    presets: [
      {
        id: "helper-import",
        label: "Import",
        toolKey: "helper-import",
        outputPorts: [RESULT_OUTPUT_PORT],
        showRunAction: false,
      },
      {
        id: "helper-export",
        label: "Export",
        toolKey: "helper-export",
        inputPorts: [VALUE_INPUT_PORT],
        showRunAction: false,
      },
      {
        id: "helper-preview",
        label: "Preview",
        toolKey: "helper-preview",
        inputPorts: [VALUE_INPUT_PORT],
        showRunAction: false,
      },
      {
        id: "helper-import-lora",
        label: "Import LoRA",
        toolKey: "helper-import-lora",
        outputPorts: [VALUE_OUTPUT_PORT],
        showRunAction: false,
      },
      {
        id: "helper-import-multiple-loras",
        label: "Import Multiple LoRAs",
        toolKey: "helper-import-multiple-loras",
        outputPorts: [VALUE_OUTPUT_PORT, INDEX_OUTPUT_PORT],
        showRunAction: false,
      },
      {
        id: "router",
        label: "Router",
        toolKey: "router",
        inputPorts: [VALUE_INPUT_PORT],
        outputPorts: [ROUTE_TRUE_OUTPUT_PORT, ROUTE_FALSE_OUTPUT_PORT],
      },
      {
        id: "output",
        label: "Output",
        toolKey: "output",
        inputPorts: [VALUE_INPUT_PORT],
        showRunAction: false,
      },
      {
        id: "depth-anything-v2",
        label: "Depth Anything V2",
        toolKey: "depth-anything-v2",
        inputPorts: [IMAGE_INPUT_PORT],
        outputPorts: [IMAGE_OUTPUT_PORT],
      },
      {
        id: "compare",
        label: "Compare",
        toolKey: "compare",
        inputPorts: [VALUE_INPUT_PORT, VALUE_INPUT_PORT_2],
        outputPorts: [VALUE_OUTPUT_PORT],
      },
      {
        id: "kling-element",
        label: "Kling Element",
        toolKey: "kling-element",
        inputPorts: [IMAGE_INPUT_PORT],
        outputPorts: [RESULT_OUTPUT_PORT],
      },
      {
        id: "runway-aleph-2-keyframe",
        label: "Runway Aleph 2 Keyframe",
        toolKey: "runway-aleph-2-keyframe",
        inputPorts: [VIDEO_INPUT_PORT],
        outputPorts: [VIDEO_OUTPUT_PORT],
      },
      {
        id: "blend",
        label: "Blend",
        toolKey: "blend",
        inputPorts: [IMAGE_INPUT_PORT, IMAGE_INPUT_PORT_2],
        outputPorts: [IMAGE_OUTPUT_PORT],
      },
    ],
  },
  {
    id: "datatypes",
    label: "Datatypes",
    presets: [
      {
        id: "number",
        label: "Number",
        toolKey: "number",
        outputPorts: [VALUE_OUTPUT_PORT],
        runLabel: "Set Value",
        showRunAction: false,
      },
      {
        id: "text",
        label: "Text",
        toolKey: "text",
        outputPorts: [TEXT_OUTPUT_PORT],
        runLabel: "Set Value",
        showRunAction: false,
      },
      {
        id: "toggle",
        label: "Toggle",
        toolKey: "toggle",
        outputPorts: [VALUE_OUTPUT_PORT],
        runLabel: "Set Value",
        showRunAction: false,
      },
      {
        id: "list-selector",
        label: "List Selector",
        toolKey: "list-selector",
        inputPorts: [LIST_INPUT_PORT],
        outputPorts: [VALUE_OUTPUT_PORT],
        showRunAction: false,
      },
      {
        id: "seed",
        label: "Seed",
        toolKey: "seed",
        outputPorts: [VALUE_OUTPUT_PORT],
        runLabel: "Set Seed",
        showRunAction: false,
      },
      {
        id: "array",
        label: "Array",
        toolKey: "array",
        inputPorts: [VALUE_INPUT_PORT],
        outputPorts: [VALUE_OUTPUT_PORT],
        addInputLabel: "Add item",
        showAddInputAction: true,
        showRunAction: false,
      },
    ],
  },
] as const

function clonePort(port: WorkflowNodePortData): WorkflowNodePortData {
  return { ...port }
}

export function createToolNodeData({
  title,
  toolKey,
  category,
  inputPorts = [],
  outputPorts = [],
  addInputLabel,
  runLabel = "Run Tool",
  showAddInputAction = false,
  showRunAction = true,
}: {
  title: string
  toolKey: string
  category: string
  inputPorts?: readonly WorkflowNodePortData[]
  outputPorts?: readonly WorkflowNodePortData[]
  addInputLabel?: string
  runLabel?: string
  showAddInputAction?: boolean
  showRunAction?: boolean
}): WorkflowNodeData {
  return {
    title,
    toolKey,
    toolCategory: category,
    inputPorts: inputPorts.map(clonePort),
    outputPorts: outputPorts.map(clonePort),
    addInputLabel,
    runLabel,
    showAddInputAction,
    showRunAction,
  }
}
