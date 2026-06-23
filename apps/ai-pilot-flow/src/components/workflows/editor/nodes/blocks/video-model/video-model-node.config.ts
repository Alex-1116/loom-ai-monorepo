import { WORKFLOW_NODE_DEFAULTS } from "@/components/workflows/editor/model/constants/node-defaults"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const videoModelNodeConfig: WorkflowNodeConfig = {
  type: "video-model",
  menuLabel: "Video Model",
  defaults: WORKFLOW_NODE_DEFAULTS["video-model"],
  ports: [],
}
