import type {
  WorkflowNodeData,
  WorkflowNodePortData,
} from "@/components/workflows/editor/model/types/workflow-node"

type ImageModelMode =
  | "generate-from-text"
  | "generate-vector-graphics"
  | "edit-images"
  | "generate-from-image"
  | "enhance-images"

export type ImageModelPreset = {
  id: string
  label: string
  modelKey: string
}

export type ImageModelMenuCategory = {
  id: ImageModelMode
  label: string
  presets: readonly ImageModelPreset[]
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

export const IMAGE_MODEL_MENU_CATEGORIES: readonly ImageModelMenuCategory[] = [
  {
    id: "generate-from-text",
    label: "Generate from text",
    presets: [
      {
        id: "chatgpt-images-2-0",
        label: "ChatGPT Images 2.0",
        modelKey: "chatgpt-images-2-0",
      },
      {
        id: "flux-2-dev-lora",
        label: "Flux 2 Dev LoRA",
        modelKey: "flux-2-dev-lora",
      },
      { id: "flux-2-pro", label: "Flux 2 Pro", modelKey: "flux-2-pro" },
      { id: "flux-2-flex", label: "Flux 2 Flex", modelKey: "flux-2-flex" },
      {
        id: "higgsfield-image",
        label: "Higgsfield Image",
        modelKey: "higgsfield-image",
      },
      { id: "imagen-4", label: "Imagen 4", modelKey: "imagen-4" },
      { id: "imagen-3", label: "Imagen 3", modelKey: "imagen-3" },
      {
        id: "imagen-3-fast",
        label: "Imagen 3 Fast",
        modelKey: "imagen-3-fast",
      },
      {
        id: "flux-pro-1-1-ultra",
        label: "Flux Pro 1.1 Ultra",
        modelKey: "flux-pro-1-1-ultra",
      },
      { id: "flux-pro-1-1", label: "Flux Pro 1.1", modelKey: "flux-pro-1-1" },
      { id: "flux-fast", label: "Flux Fast", modelKey: "flux-fast" },
      {
        id: "flux-dev-lora",
        label: "Flux Dev LoRA",
        modelKey: "flux-dev-lora",
      },
      { id: "recraft-v4", label: "Recraft V4", modelKey: "recraft-v4" },
      { id: "recraft-v3", label: "Recraft V3", modelKey: "recraft-v3" },
      { id: "mystic", label: "Mystic", modelKey: "mystic" },
      { id: "ideogram-v3", label: "Ideogram V3", modelKey: "ideogram-v3" },
      {
        id: "ideogram-v3-character",
        label: "Ideogram V3 Character",
        modelKey: "ideogram-v3-character",
      },
      {
        id: "stable-diffusion-3-5",
        label: "Stable Diffusion 3.5",
        modelKey: "stable-diffusion-3-5",
      },
      {
        id: "minimax-image-01",
        label: "Minimax Image 01",
        modelKey: "minimax-image-01",
      },
      { id: "bria", label: "Bria", modelKey: "bria" },
      { id: "luma-photon", label: "Luma Photon", modelKey: "luma-photon" },
      { id: "nvidia-sana", label: "Nvidia Sana", modelKey: "nvidia-sana" },
      { id: "ideogram-v4", label: "Ideogram V4", modelKey: "ideogram-v4" },
      { id: "krea-2", label: "Krea 2", modelKey: "krea-2" },
    ],
  },
  {
    id: "generate-vector-graphics",
    label: "Generate vector graphics",
    presets: [
      {
        id: "recraft-vectorizer",
        label: "Recraft Vectorizer",
        modelKey: "recraft-vectorizer",
      },
      { id: "vectorizer", label: "Vectorizer", modelKey: "vectorizer" },
      {
        id: "recraft-v3-svg",
        label: "Recraft V3 SVG",
        modelKey: "recraft-v3-svg",
      },
      {
        id: "text-to-vector",
        label: "Text To Vector",
        modelKey: "text-to-vector",
      },
    ],
  },
  {
    id: "edit-images",
    label: "Edit images",
    presets: [
      {
        id: "chatgpt-images-2-0-edit",
        label: "ChatGPT Images 2.0 Edit",
        modelKey: "chatgpt-images-2-0-edit",
      },
      {
        id: "nano-banana-2",
        label: "Nano Banana 2",
        modelKey: "nano-banana-2",
      },
      { id: "flux-2-max", label: "Flux 2 Max", modelKey: "flux-2-max" },
      {
        id: "seedream-v4-5-edit",
        label: "Seedream V4.5 Edit",
        modelKey: "seedream-v4-5-edit",
      },
      {
        id: "seedream-v5-edit",
        label: "Seedream V5 Edit",
        modelKey: "seedream-v5-edit",
      },
      {
        id: "nano-banana-pro",
        label: "Nano Banana Pro",
        modelKey: "nano-banana-pro",
      },
      { id: "wan-2-7", label: "Wan 2.7", modelKey: "wan-2-7" },
      {
        id: "qwen-image-edit-plus",
        label: "Qwen Image Edit Plus",
        modelKey: "qwen-image-edit-plus",
      },
      { id: "nano-banana", label: "Nano Banana", modelKey: "nano-banana" },
      {
        id: "runway-gen-4-image",
        label: "Runway Gen-4 Image",
        modelKey: "runway-gen-4-image",
      },
      { id: "flux-kontext", label: "Flux Kontext", modelKey: "flux-kontext" },
      {
        id: "flux-kontext-lora",
        label: "Flux Kontext LoRA",
        modelKey: "flux-kontext-lora",
      },
      {
        id: "flux-kontext-multi-image",
        label: "Flux Kontext Multi Image",
        modelKey: "flux-kontext-multi-image",
      },
      {
        id: "flux-fill-pro",
        label: "Flux Fill Pro",
        modelKey: "flux-fill-pro",
      },
      {
        id: "flux-2-inpaint-klein-9b",
        label: "Flux 2 Inpaint [Klein 9B]",
        modelKey: "flux-2-inpaint-klein-9b",
      },
      {
        id: "flux-dev-lora-inpaint",
        label: "Flux Dev LoRA Inpaint",
        modelKey: "flux-dev-lora-inpaint",
      },
      {
        id: "ideogram-v3-inpaint",
        label: "Ideogram V3 Inpaint",
        modelKey: "ideogram-v3-inpaint",
      },
      {
        id: "ideogram-v2-inpaint",
        label: "Ideogram V2 Inpaint",
        modelKey: "ideogram-v2-inpaint",
      },
      { id: "sd3-inpaint", label: "SD3 Inpaint", modelKey: "sd3-inpaint" },
      { id: "bria-inpaint", label: "Bria Inpaint", modelKey: "bria-inpaint" },
      {
        id: "flux-pro-outpaint",
        label: "Flux Pro Outpaint",
        modelKey: "flux-pro-outpaint",
      },
      { id: "sd3-outpaint", label: "SD3 Outpaint", modelKey: "sd3-outpaint" },
      {
        id: "sd3-remove-background",
        label: "SD3 Remove Background",
        modelKey: "sd3-remove-background",
      },
      {
        id: "bria-remove-background",
        label: "Bria Remove Background",
        modelKey: "bria-remove-background",
      },
      {
        id: "sd3-content-aware-fill",
        label: "SD3 Content-Aware Fill",
        modelKey: "sd3-content-aware-fill",
      },
      {
        id: "bria-content-aware-fill",
        label: "Bria Content-Aware Fill",
        modelKey: "bria-content-aware-fill",
      },
      {
        id: "kolors-virtual-try-on",
        label: "Kolors Virtual Try On",
        modelKey: "kolors-virtual-try-on",
      },
      {
        id: "replace-background",
        label: "Replace Background",
        modelKey: "replace-background",
      },
      {
        id: "bria-replace-background",
        label: "Bria Replace Background",
        modelKey: "bria-replace-background",
      },
      { id: "relight-2-0", label: "Relight 2.0", modelKey: "relight-2-0" },
    ],
  },
  {
    id: "generate-from-image",
    label: "Generate from image",
    presets: [
      {
        id: "qwen-edit-multiangle",
        label: "Qwen Edit Multiangle",
        modelKey: "qwen-edit-multiangle",
      },
      {
        id: "flux-dev-redux",
        label: "Flux Dev Redux",
        modelKey: "flux-dev-redux",
      },
      {
        id: "flux-controlnet-and-lora",
        label: "Flux ControlNet & LoRA",
        modelKey: "flux-controlnet-and-lora",
      },
      {
        id: "flux-canny-pro",
        label: "Flux Canny Pro",
        modelKey: "flux-canny-pro",
      },
      {
        id: "flux-depth-pro",
        label: "Flux Depth Pro",
        modelKey: "flux-depth-pro",
      },
      {
        id: "image-to-image",
        label: "Image To Image",
        modelKey: "image-to-image",
      },
      {
        id: "stable-diffusion-controlne",
        label: "Stable Diffusion Controlne...",
        modelKey: "stable-diffusion-controlne",
      },
      {
        id: "sketch-to-image",
        label: "Sketch to Image",
        modelKey: "sketch-to-image",
      },
    ],
  },
  {
    id: "enhance-images",
    label: "Enhance images",
    presets: [
      {
        id: "topaz-image-upscale",
        label: "Topaz Image Upscale",
        modelKey: "topaz-image-upscale",
      },
      {
        id: "topaz-sharpen",
        label: "Topaz Sharpen",
        modelKey: "topaz-sharpen",
      },
      {
        id: "magnific-skin-enhancer",
        label: "Magnific Skin Enhancer",
        modelKey: "magnific-skin-enhancer",
      },
      {
        id: "magnific-upscale",
        label: "Magnific Upscale",
        modelKey: "magnific-upscale",
      },
      {
        id: "magnific-precision-upscal",
        label: "Magnific Precision Upscal...",
        modelKey: "magnific-precision-upscal",
      },
      {
        id: "magnific-precision-upscale",
        label: "Magnific Precision Upscale",
        modelKey: "magnific-precision-upscale",
      },
      {
        id: "enhancor-image-upscale",
        label: "Enhancor Image Upscale",
        modelKey: "enhancor-image-upscale",
      },
      {
        id: "enhancor-realistic-skin",
        label: "Enhancor Realistic Skin",
        modelKey: "enhancor-realistic-skin",
      },
      {
        id: "recraft-crisp-upscale",
        label: "Recraft Crisp Upscale",
        modelKey: "recraft-crisp-upscale",
      },
    ],
  },
] as const

function clonePort(port: WorkflowNodePortData): WorkflowNodePortData {
  return { ...port }
}

export function createImageModelNodeData({
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
