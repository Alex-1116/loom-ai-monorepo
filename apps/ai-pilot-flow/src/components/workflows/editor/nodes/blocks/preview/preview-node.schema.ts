import { getPreviewSchema } from "@/components/workflows/editor/model/constants/preview-definitions"
import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const previewNodeSchema: WorkflowNodeSchema = {
  type: "preview",
  fields: getPreviewSchema()?.fields ?? [],
}
