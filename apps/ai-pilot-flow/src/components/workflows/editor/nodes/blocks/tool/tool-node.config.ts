import { WORKFLOW_NODE_DEFAULTS } from "@/components/workflows/editor/model/constants/node-defaults"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const toolNodeConfig: WorkflowNodeConfig = {
  type: "tool",
  menuLabel: "Tool",
  defaults: WORKFLOW_NODE_DEFAULTS.tool,
  ports: [],
}
