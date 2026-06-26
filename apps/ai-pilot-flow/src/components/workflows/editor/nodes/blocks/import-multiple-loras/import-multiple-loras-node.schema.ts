import { getImportMultipleLorasSchema } from "@/components/workflows/editor/model/constants/import-multiple-loras-definitions"
import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const importMultipleLorasNodeSchema: WorkflowNodeSchema = {
  type: "import-multiple-loras",
  fields: getImportMultipleLorasSchema()?.fields ?? [],
}
