import { getFileSchema } from "@/components/workflows/editor/model/constants/file-definitions"
import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const fileNodeSchema: WorkflowNodeSchema = {
  type: "file",
  fields: getFileSchema()?.fields ?? [],
}
