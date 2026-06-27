import { getDefaultToolDefinition } from "@/components/workflows/editor/model/constants/tool-definitions"
import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const toolNodeSchema: WorkflowNodeSchema = {
  type: "tool",
  fields: getDefaultToolDefinition()?.schema?.fields ?? [],
}
