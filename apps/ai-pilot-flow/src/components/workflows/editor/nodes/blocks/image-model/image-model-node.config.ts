import { createDefaultImageModelNodeData } from "@/components/workflows/editor/model/constants/image-model-definitions"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const imageModelNodeConfig: WorkflowNodeConfig = {
  type: "image-model",
  menuLabel: "Image Model",
  defaults: createDefaultImageModelNodeData() ?? {
    title: "Flux 2 Pro",
    modelKey: "flux-2-pro",
    runLabel: "Run Model",
    showAddInputAction: true,
    showRunAction: true,
  },
  ports: [],
}
