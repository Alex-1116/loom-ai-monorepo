import { WORKFLOW_NODE_DEFAULTS } from "@/components/workflows/editor/model/constants/node-defaults"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const importLoraNodeConfig: WorkflowNodeConfig = {
  type: "import-lora",
  menuLabel: "Import LoRA",
  defaults: WORKFLOW_NODE_DEFAULTS["import-lora"],
  ports: [
    {
      key: "output",
      side: "right",
      label: "LoRA URL",
      labelVisibility: "hover",
    },
  ],
}
