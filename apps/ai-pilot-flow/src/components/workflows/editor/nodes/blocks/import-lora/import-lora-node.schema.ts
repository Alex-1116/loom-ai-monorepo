import { getImportLoraSchema } from "@/components/workflows/editor/model/constants/import-lora-definitions"
import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const importLoraNodeSchema: WorkflowNodeSchema = {
  type: "import-lora",
  fields: getImportLoraSchema()?.fields ?? [],
}
