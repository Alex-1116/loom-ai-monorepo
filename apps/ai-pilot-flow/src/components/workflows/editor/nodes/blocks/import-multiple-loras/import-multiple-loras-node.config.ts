import { WORKFLOW_NODE_DEFAULTS } from "@/components/workflows/editor/model/constants/node-defaults"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const importMultipleLorasNodeConfig: WorkflowNodeConfig = {
  type: "import-multiple-loras",
  menuLabel: "Import Multiple LoRAs",
  defaults: WORKFLOW_NODE_DEFAULTS["import-multiple-loras"],
  ports: [
    {
      key: "lora-url",
      side: "right",
      label: "LoRA URL",
      labelVisibility: "hover",
      portToneClassName: "border-[#d88cff] bg-[#1c1d26]",
      labelToneClassName: "text-[#d88cff]/70",
    },
    {
      key: "weight",
      side: "right",
      label: "Weight",
      labelVisibility: "hover",
      portToneClassName: "border-[#ace3b3] bg-[#1c1d26]",
      labelToneClassName: "text-[#ace3b3]/70",
    },
  ],
}
