import { WORKFLOW_NODE_DEFAULTS } from "@/components/workflows/editor/model/constants/node-defaults"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const previewNodeConfig: WorkflowNodeConfig = {
  type: "preview",
  menuLabel: "Preview",
  defaults: WORKFLOW_NODE_DEFAULTS.preview,
  ports: [
    {
      key: "input",
      side: "left",
      label: "File",
      labelVisibility: "hover",
    },
  ],
}
