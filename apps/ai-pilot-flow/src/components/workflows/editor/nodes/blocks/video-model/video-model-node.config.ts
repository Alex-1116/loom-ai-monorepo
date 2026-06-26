import { createDefaultVideoModelNodeData } from "@/components/workflows/editor/model/constants/video-model-definitions"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const videoModelNodeConfig: WorkflowNodeConfig = {
  type: "video-model",
  menuLabel: "Video Model",
  defaults: createDefaultVideoModelNodeData() ?? {
    title: "Kling 3.0 Turbo",
    modelKey: "kling-3-0-turbo",
    runLabel: "Run Model",
    showAddInputAction: true,
    showRunAction: true,
  },
  ports: [],
}
