import type {
  WorkflowNodeData,
  WorkflowNodePortData,
} from "@/components/workflows/editor/model/types/workflow-node"

type ThreeDModelMode = "generate-from-text-or-image" | "generate-textures"

export type ThreeDModelPreset = {
  id: string
  label: string
  modelKey: string
}

export type ThreeDModelMenuCategory = {
  id: ThreeDModelMode
  label: string
  presets: readonly ThreeDModelPreset[]
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

export const THREE_D_MODEL_MENU_CATEGORIES: readonly ThreeDModelMenuCategory[] =
  [
    {
      id: "generate-from-text-or-image",
      label: "Generate from text or image",
      presets: [
        { id: "meshy-v6", label: "Meshy V6", modelKey: "meshy-v6" },
        { id: "tripo-h3-1", label: "Tripo H3.1", modelKey: "tripo-h3-1" },
        {
          id: "sam-3d-objects",
          label: "SAM 3D - Objects",
          modelKey: "sam-3d-objects",
        },
        { id: "rodin-v2", label: "Rodin V2", modelKey: "rodin-v2" },
        { id: "rodin", label: "Rodin", modelKey: "rodin" },
        {
          id: "hunyuan-3d-v3",
          label: "Hunyuan 3D V3",
          modelKey: "hunyuan-3d-v3",
        },
        {
          id: "hunyuan-3d-v2-1",
          label: "Hunyuan 3D V2.1",
          modelKey: "hunyuan-3d-v2-1",
        },
        {
          id: "hunyuan-3d-v2-0",
          label: "Hunyuan 3D V2.0",
          modelKey: "hunyuan-3d-v2-0",
        },
        {
          id: "trellis-3d-v2",
          label: "Trellis 3D V2",
          modelKey: "trellis-3d-v2",
        },
        { id: "trellis", label: "Trellis", modelKey: "trellis" },
      ],
    },
    {
      id: "generate-textures",
      label: "Generate textures",
      presets: [
        { id: "patina", label: "Patina", modelKey: "patina" },
        {
          id: "patina-extract",
          label: "Patina Extract",
          modelKey: "patina-extract",
        },
        {
          id: "patina-material",
          label: "Patina Material",
          modelKey: "patina-material",
        },
      ],
    },
  ] as const

function clonePort(port: WorkflowNodePortData): WorkflowNodePortData {
  return { ...port }
}

export function createThreeDModelNodeData({
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
