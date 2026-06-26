import { getExportSchema } from "@/components/workflows/editor/model/constants/export-definitions"
import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const exportNodeSchema: WorkflowNodeSchema = {
  type: "export",
  fields: getExportSchema()?.fields ?? [],
}
