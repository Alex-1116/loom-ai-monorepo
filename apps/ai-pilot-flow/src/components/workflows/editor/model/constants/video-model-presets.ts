import type {
  WorkflowNodeData,
  WorkflowNodePortData,
} from "@/components/workflows/editor/model/types/workflow-node"

type VideoModelMode =
  | "generate-from-text-or-image"
  | "generate-from-video"
  | "lip-sync"
  | "enhance-videos"

export type VideoModelPreset = {
  id: string
  label: string
  modelKey: string
}

export type VideoModelMenuCategory = {
  id: VideoModelMode
  label: string
  presets: readonly VideoModelPreset[]
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

export const VIDEO_MODEL_MENU_CATEGORIES: readonly VideoModelMenuCategory[] = [
  {
    id: "generate-from-text-or-image",
    label: "Generate from text or image",
    presets: [
      {
        id: "kling-3-0-turbo",
        label: "Kling 3.0 Turbo",
        modelKey: "kling-3-0-turbo",
      },
      {
        id: "veed-fabric-1-0",
        label: "Veed Fabric 1.0",
        modelKey: "veed-fabric-1-0",
      },
      { id: "seedance-2-0", label: "Seedance 2.0", modelKey: "seedance-2-0" },
      {
        id: "seedance-2-0-reference",
        label: "Seedance 2.0 Reference",
        modelKey: "seedance-2-0-reference",
      },
      { id: "luma-ray-3-2", label: "Luma Ray 3.2", modelKey: "luma-ray-3-2" },
      {
        id: "grok-imagine-video",
        label: "Grok Imagine Video",
        modelKey: "grok-imagine-video",
      },
      {
        id: "veo-3-1-text-to-video",
        label: "Veo 3.1 Text to Video",
        modelKey: "veo-3-1-text-to-video",
      },
      { id: "pixverse-6", label: "Pixverse 6", modelKey: "pixverse-6" },
      {
        id: "wan-2-7-video",
        label: "Wan 2.7 Video",
        modelKey: "wan-2-7-video",
      },
      {
        id: "veo-3-1-image-to-video",
        label: "Veo 3.1 Image to Video",
        modelKey: "veo-3-1-image-to-video",
      },
      {
        id: "seedance-v1-5-pro",
        label: "Seedance V1.5 Pro",
        modelKey: "seedance-v1-5-pro",
      },
      { id: "sora-2", label: "Sora 2", modelKey: "sora-2" },
      { id: "ltx-2-video", label: "LTX 2 Video", modelKey: "ltx-2-video" },
      {
        id: "higgsfield-video",
        label: "Higgsfield Video",
        modelKey: "higgsfield-video",
      },
      { id: "wan-2-5", label: "Wan 2.5", modelKey: "wan-2-5" },
      { id: "wan-2-2", label: "Wan 2.2", modelKey: "wan-2-2" },
      { id: "moonvalley", label: "Moonvalley", modelKey: "moonvalley" },
      {
        id: "seedance-v1-0",
        label: "Seedance V1.0",
        modelKey: "seedance-v1-0",
      },
      {
        id: "pixverse-v4-5",
        label: "Pixverse V4.5",
        modelKey: "pixverse-v4-5",
      },
      { id: "runway-gen-4", label: "Runway Gen-4", modelKey: "runway-gen-4" },
      {
        id: "runway-gen-4-turbo",
        label: "Runway Gen-4 Turbo",
        modelKey: "runway-gen-4-turbo",
      },
      {
        id: "runway-gen-4-5",
        label: "Runway Gen-4.5",
        modelKey: "runway-gen-4-5",
      },
      {
        id: "runway-gen-3-turbo",
        label: "Runway Gen-3 Turbo",
        modelKey: "runway-gen-3-turbo",
      },
      { id: "kling-3", label: "Kling 3", modelKey: "kling-3" },
      { id: "kling-1-6", label: "Kling 1.6", modelKey: "kling-1-6" },
      { id: "kling-video", label: "Kling Video", modelKey: "kling-video" },
      {
        id: "kling-first-and-last-frame",
        label: "Kling First & Last Frame",
        modelKey: "kling-first-and-last-frame",
      },
      {
        id: "minimax-hailuo-02",
        label: "Minimax Hailuo-02",
        modelKey: "minimax-hailuo-02",
      },
      { id: "veo-2", label: "Veo 2", modelKey: "veo-2" },
      {
        id: "minimax-video-director",
        label: "Minimax Video Director",
        modelKey: "minimax-video-director",
      },
    ],
  },
  {
    id: "generate-from-video",
    label: "Generate from video",
    presets: [
      {
        id: "runway-aleph-2",
        label: "Runway Aleph 2",
        modelKey: "runway-aleph-2",
      },
      {
        id: "luma-ray-3-2-video-edit",
        label: "Luma Ray 3.2 Video Edit",
        modelKey: "luma-ray-3-2-video-edit",
      },
      {
        id: "veed-background-removal",
        label: "Veed Background Removal",
        modelKey: "veed-background-removal",
      },
      {
        id: "grok-imagine-video-edit",
        label: "Grok Imagine - Video edit",
        modelKey: "grok-imagine-video-edit",
      },
      {
        id: "pixverse-6-extend",
        label: "Pixverse 6 Extend",
        modelKey: "pixverse-6-extend",
      },
      {
        id: "ltx-2-video-to-video",
        label: "LTX 2 - Video to Video",
        modelKey: "ltx-2-video-to-video",
      },
      {
        id: "wan-2-7-video-edit",
        label: "Wan 2.7 Video Edit",
        modelKey: "wan-2-7-video-edit",
      },
      {
        id: "kling-o3-edit-video",
        label: "Kling o3 Edit Video",
        modelKey: "kling-o3-edit-video",
      },
      {
        id: "kling-motion-control",
        label: "Kling Motion Control",
        modelKey: "kling-motion-control",
      },
      {
        id: "kling-o1-edit-video",
        label: "Kling o1 Edit Video",
        modelKey: "kling-o1-edit-video",
      },
      {
        id: "kling-o1-reference-video-t",
        label: "Kling o1 Reference Video t...",
        modelKey: "kling-o1-reference-video-t",
      },
      {
        id: "beeble-switchx",
        label: "Beeble SwitchX",
        modelKey: "beeble-switchx",
      },
      { id: "runway-aleph", label: "Runway Aleph", modelKey: "runway-aleph" },
      {
        id: "runway-act-two",
        label: "Runway Act-Two",
        modelKey: "runway-act-two",
      },
      { id: "luma-reframe", label: "Luma Reframe", modelKey: "luma-reframe" },
      { id: "luma-modify", label: "Luma Modify", modelKey: "luma-modify" },
      {
        id: "video-background-removal",
        label: "Video Background Removal",
        modelKey: "video-background-removal",
      },
      {
        id: "void-video-object-remo",
        label: "Void - Video Object Remo...",
        modelKey: "void-video-object-remo",
      },
      {
        id: "veed-subtitles",
        label: "Veed Subtitles",
        modelKey: "veed-subtitles",
      },
      {
        id: "wan-2-2-animate-replace",
        label: "Wan 2.2 Animate - Replace",
        modelKey: "wan-2-2-animate-replace",
      },
      {
        id: "wan-2-2-animate-move",
        label: "Wan 2.2 Animate - Move",
        modelKey: "wan-2-2-animate-move",
      },
      {
        id: "wan-vace-depth",
        label: "Wan Vace Depth",
        modelKey: "wan-vace-depth",
      },
      {
        id: "wan-vace-pose",
        label: "Wan Vace Pose",
        modelKey: "wan-vace-pose",
      },
      {
        id: "wan-vace-reframe",
        label: "Wan Vace Reframe",
        modelKey: "wan-vace-reframe",
      },
      {
        id: "wan-vace-outpaint",
        label: "Wan Vace Outpaint",
        modelKey: "wan-vace-outpaint",
      },
      {
        id: "hunyuan-video-to-video",
        label: "Hunyuan Video to Video",
        modelKey: "hunyuan-video-to-video",
      },
      {
        id: "happy-horse-edit",
        label: "Happy Horse Edit",
        modelKey: "happy-horse-edit",
      },
    ],
  },
  {
    id: "lip-sync",
    label: "Lip sync",
    presets: [
      {
        id: "omnihuman-v1-5",
        label: "Omnihuman V1.5",
        modelKey: "omnihuman-v1-5",
      },
      { id: "sync-2-pro", label: "Sync 2 Pro", modelKey: "sync-2-pro" },
      {
        id: "kling-ai-avatar",
        label: "Kling AI Avatar",
        modelKey: "kling-ai-avatar",
      },
      {
        id: "pixverse-lipsync",
        label: "Pixverse Lipsync",
        modelKey: "pixverse-lipsync",
      },
      {
        id: "veed-fabric-1-0-lip-sync",
        label: "Veed Fabric 1.0 Lip Sync",
        modelKey: "veed-fabric-1-0-lip-sync",
      },
    ],
  },
  {
    id: "enhance-videos",
    label: "Enhance videos",
    presets: [
      {
        id: "topaz-video-upscaler",
        label: "Topaz Video Upscaler",
        modelKey: "topaz-video-upscaler",
      },
      { id: "bria-upscale", label: "Bria Upscale", modelKey: "bria-upscale" },
      {
        id: "real-esrgan-video-upsc",
        label: "Real-ESRGAN Video Upsc...",
        modelKey: "real-esrgan-video-upsc",
      },
      {
        id: "video-smoother",
        label: "Video Smoother",
        modelKey: "video-smoother",
      },
    ],
  },
] as const

function clonePort(port: WorkflowNodePortData): WorkflowNodePortData {
  return { ...port }
}

export function createVideoModelNodeData({
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
