import type {
  WorkflowNodeData,
  WorkflowNodeType,
} from "@/components/workflows/editor/model/types/workflow-node"

export const DEFAULT_PROMPT_NODE_CONTENT =
  'Hipster Sisyphus, lime overall suit, pushing a huge round rock up a hill. The rock is sprayed with the text "default prompt", bright grey background extreme side long shot, cinematic, fashion style, side view'

export const WORKFLOW_NODE_DEFAULTS: Record<
  WorkflowNodeType,
  WorkflowNodeData
> = {
  prompt: {
    title: "Prompt",
    content: DEFAULT_PROMPT_NODE_CONTENT,
  },
  file: {
    title: "File",
  },
  preview: {
    title: "Preview",
    inputLabel: "File",
  },
  export: {
    title: "Export",
    inputLabel: "Input",
    actionLabel: "Export",
  },
  "import-lora": {
    title: "Import LoRA",
    outputLabel: "LoRA URL",
  },
  "import-multiple-loras": {
    title: "Import Multiple LoRAs",
    outputLabel: "LoRA URL",
    secondaryOutputLabel: "Weight",
  },
  "image-model": {
    title: "Flux 2 Pro",
    modelKey: "flux-2-pro",
    inputPorts: [
      {
        key: "prompt",
        label: "Prompt *",
        side: "left",
        labelVisibility: "hover",
        portToneClassName: "border-[#d78cff] bg-[#1c1d26]",
        labelToneClassName: "text-[#d78cff]",
      },
      {
        key: "image-1",
        label: "Image 1",
        side: "left",
        labelVisibility: "hover",
        portToneClassName: "border-[#6fe7d1] bg-[#1c1d26]",
        labelToneClassName: "text-[#6fe7d1]",
      },
    ],
    outputPorts: [
      {
        key: "result",
        label: "Result",
        side: "right",
        labelVisibility: "hover",
        portToneClassName: "border-[#6fe7d1] bg-[#1c1d26]",
        labelToneClassName: "text-[#6fe7d1]",
      },
    ],
    addInputLabel: "Add another image input",
    runLabel: "Run Model",
    showAddInputAction: true,
    showRunAction: true,
  },
  "video-model": {
    title: "Kling 3.0 Turbo",
    modelKey: "kling-3-0-turbo",
    inputPorts: [
      {
        key: "prompt",
        label: "Prompt *",
        side: "left",
        labelVisibility: "hover",
        portToneClassName: "border-[#d78cff] bg-[#1c1d26]",
        labelToneClassName: "text-[#d78cff]",
      },
      {
        key: "image-1",
        label: "Image 1",
        side: "left",
        labelVisibility: "hover",
        portToneClassName: "border-[#6fe7d1] bg-[#1c1d26]",
        labelToneClassName: "text-[#6fe7d1]",
      },
    ],
    outputPorts: [
      {
        key: "result",
        label: "Result",
        side: "right",
        labelVisibility: "hover",
        portToneClassName: "border-[#6fe7d1] bg-[#1c1d26]",
        labelToneClassName: "text-[#6fe7d1]",
      },
    ],
    addInputLabel: "Add another input",
    runLabel: "Run Model",
    showAddInputAction: true,
    showRunAction: true,
  },
  "3d-model": {
    title: "Meshy V6",
    modelKey: "meshy-v6",
    inputPorts: [
      {
        key: "prompt",
        label: "Prompt *",
        side: "left",
        labelVisibility: "hover",
        portToneClassName: "border-[#d78cff] bg-[#1c1d26]",
        labelToneClassName: "text-[#d78cff]",
      },
      {
        key: "image-1",
        label: "Image 1",
        side: "left",
        labelVisibility: "hover",
        portToneClassName: "border-[#6fe7d1] bg-[#1c1d26]",
        labelToneClassName: "text-[#6fe7d1]",
      },
    ],
    outputPorts: [
      {
        key: "result",
        label: "Result",
        side: "right",
        labelVisibility: "hover",
        portToneClassName: "border-[#6fe7d1] bg-[#1c1d26]",
        labelToneClassName: "text-[#6fe7d1]",
      },
    ],
    addInputLabel: "Add image input",
    runLabel: "Run Model",
    showAddInputAction: true,
    showRunAction: true,
  },
  tool: {
    title: "Rotate and flip",
    toolKey: "rotate-and-flip",
    toolCategory: "Editing",
    inputPorts: [
      {
        key: "image-1",
        label: "Image 1",
        side: "left",
        labelVisibility: "hover",
        portToneClassName: "border-[#6fe7d1] bg-[#1c1d26]",
        labelToneClassName: "text-[#6fe7d1]",
      },
    ],
    outputPorts: [
      {
        key: "image",
        label: "Image",
        side: "right",
        labelVisibility: "hover",
        portToneClassName: "border-[#6fe7d1] bg-[#1c1d26]",
        labelToneClassName: "text-[#6fe7d1]",
      },
    ],
    runLabel: "Run Tool",
    showAddInputAction: false,
    showRunAction: true,
  },
}
