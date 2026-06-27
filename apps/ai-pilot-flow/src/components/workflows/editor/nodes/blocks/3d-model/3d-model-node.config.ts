import { createDefaultThreeDModelNodeData } from "@/components/workflows/editor/model/constants/3d-model-definitions"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const threeDModelNodeConfig: WorkflowNodeConfig = {
  type: "3d-model",
  menuLabel: "3D Model",
  defaults: createDefaultThreeDModelNodeData() ?? {
    title: "Meshy V6",
    modelKey: "meshy-v6",
    runLabel: "Run Model",
    showAddInputAction: true,
    showRunAction: true,
  },
  ports: [],
}
