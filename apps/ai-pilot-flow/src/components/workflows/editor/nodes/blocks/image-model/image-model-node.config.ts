import { WORKFLOW_NODE_DEFAULTS } from "@/components/workflows/editor/model/constants/node-defaults"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const imageModelNodeConfig: WorkflowNodeConfig = {
  type: "image-model",
  menuLabel: "Image Model",
  defaults: WORKFLOW_NODE_DEFAULTS["image-model"],
  ports: [],
}
