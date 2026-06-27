import { getDefaultThreeDModelDefinition } from "@/components/workflows/editor/model/constants/3d-model-definitions"
import { getDefaultImageModelDefinition } from "@/components/workflows/editor/model/constants/image-model-definitions"
import { getDefaultToolDefinition } from "@/components/workflows/editor/model/constants/tool-definitions"
import { getDefaultVideoModelDefinition } from "@/components/workflows/editor/model/constants/video-model-definitions"
import type {
  WorkflowNodeData,
  WorkflowNodeType,
} from "@/components/workflows/editor/model/types/workflow-node"

const DEFAULT_TOOL_DEFINITION = getDefaultToolDefinition()
const DEFAULT_IMAGE_MODEL_DEFINITION = getDefaultImageModelDefinition()
const DEFAULT_VIDEO_MODEL_DEFINITION = getDefaultVideoModelDefinition()
const DEFAULT_THREE_D_MODEL_DEFINITION = getDefaultThreeDModelDefinition()

export const WORKFLOW_NODE_DEFAULTS: Record<
  WorkflowNodeType,
  WorkflowNodeData
> = {
  "image-model": DEFAULT_IMAGE_MODEL_DEFINITION
    ? DEFAULT_IMAGE_MODEL_DEFINITION.createData()
    : {
        title: "Flux 2 Pro",
        modelKey: "flux-2-pro",
        runLabel: "Run Model",
        showAddInputAction: true,
        showRunAction: true,
      },
  "video-model": DEFAULT_VIDEO_MODEL_DEFINITION
    ? DEFAULT_VIDEO_MODEL_DEFINITION.createData()
    : {
        title: "Kling 3.0 Turbo",
        modelKey: "kling-3-0-turbo",
        runLabel: "Run Model",
        showAddInputAction: true,
        showRunAction: true,
      },
  "3d-model": DEFAULT_THREE_D_MODEL_DEFINITION
    ? DEFAULT_THREE_D_MODEL_DEFINITION.createData()
    : {
        title: "Meshy V6",
        modelKey: "meshy-v6",
        runLabel: "Run Model",
        showAddInputAction: true,
        showRunAction: true,
      },
  tool: DEFAULT_TOOL_DEFINITION
    ? DEFAULT_TOOL_DEFINITION.createData()
    : {
        title: "Tool",
        toolKey: "tool",
        toolCategory: "Tools",
        runLabel: "Run Tool",
        showAddInputAction: false,
        showRunAction: true,
      },
}
