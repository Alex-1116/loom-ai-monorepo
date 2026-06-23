import { WORKFLOW_NODE_DEFAULTS } from "@/components/workflows/editor/model/constants/node-defaults"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const threeDModelNodeConfig: WorkflowNodeConfig = {
  type: "3d-model",
  menuLabel: "3D Model",
  defaults: WORKFLOW_NODE_DEFAULTS["3d-model"],
  ports: [],
}
