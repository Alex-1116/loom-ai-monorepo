import { WORKFLOW_NODE_DEFAULTS } from "@/components/workflows/editor/model/constants/node-defaults"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const fileNodeConfig: WorkflowNodeConfig = {
  type: "file",
  menuLabel: "Import",
  defaults: WORKFLOW_NODE_DEFAULTS.file,
  ports: [
    {
      key: "output",
      side: "right",
      label: "File",
      labelVisibility: "hover",
    },
  ],
}
