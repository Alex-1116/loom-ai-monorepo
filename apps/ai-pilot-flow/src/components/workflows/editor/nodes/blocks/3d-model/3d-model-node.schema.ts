import { getThreeDModelSchema } from "@/components/workflows/editor/model/constants/3d-model-definitions"
import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const threeDModelNodeSchema: WorkflowNodeSchema = {
  type: "3d-model",
  fields: getThreeDModelSchema("meshy-v6")?.fields ?? [],
}
