import { getPromptSchema } from "@/components/workflows/editor/model/constants/prompt-definitions"
import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const promptNodeSchema: WorkflowNodeSchema = {
  type: "prompt",
  fields: getPromptSchema()?.fields ?? [],
}
