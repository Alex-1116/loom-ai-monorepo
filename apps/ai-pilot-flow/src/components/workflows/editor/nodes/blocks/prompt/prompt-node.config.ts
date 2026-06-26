import { createPromptNodeData } from "@/components/workflows/editor/model/constants/prompt-definitions"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const promptNodeConfig: WorkflowNodeConfig = {
  type: "prompt",
  menuLabel: "Prompt",
  defaults: createPromptNodeData(),
  ports: [],
}
