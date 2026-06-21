import { WORKFLOW_NODE_DEFAULTS } from "@/components/workflows/editor/model/constants/node-defaults"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const promptNodeConfig: WorkflowNodeConfig = {
  type: "prompt",
  menuLabel: "Prompt",
  defaults: WORKFLOW_NODE_DEFAULTS.prompt,
  ports: [
    {
      key: "output",
      side: "right",
      label: "Prompt",
      labelVisibility: "hover",
      portToneClassName: "border-[#d88cff] bg-[#1c1d26]",
      labelToneClassName: "text-[#d88cff]/70",
    },
  ],
}
