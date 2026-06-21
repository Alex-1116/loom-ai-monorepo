import { WORKFLOW_NODE_DEFAULTS } from "@/components/workflows/editor/model/constants/node-defaults"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const exportNodeConfig: WorkflowNodeConfig = {
  type: "export",
  menuLabel: "Export",
  defaults: WORKFLOW_NODE_DEFAULTS.export,
  ports: [
    {
      key: "input",
      side: "left",
      label: "Input",
      labelVisibility: "hover",
    },
  ],
}
