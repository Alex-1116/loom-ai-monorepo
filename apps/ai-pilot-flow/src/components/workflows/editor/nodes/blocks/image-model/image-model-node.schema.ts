import { getImageModelSchema } from "@/components/workflows/editor/model/constants/image-model-definitions"
import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const imageModelNodeSchema: WorkflowNodeSchema = {
  type: "image-model",
  fields: getImageModelSchema("flux-2-pro")?.fields ?? [],
}
