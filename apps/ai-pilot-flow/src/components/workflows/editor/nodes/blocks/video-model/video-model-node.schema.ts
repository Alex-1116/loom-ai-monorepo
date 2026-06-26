import { getVideoModelSchema } from "@/components/workflows/editor/model/constants/video-model-definitions"
import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const videoModelNodeSchema: WorkflowNodeSchema = {
  type: "video-model",
  fields: getVideoModelSchema("kling-3-0-turbo")?.fields ?? [],
}
