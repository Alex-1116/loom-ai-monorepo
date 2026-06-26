import { createPreviewNodeData } from "@/components/workflows/editor/model/constants/preview-definitions"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const previewNodeConfig: WorkflowNodeConfig = {
  type: "preview",
  menuLabel: "Preview",
  defaults: createPreviewNodeData(),
  ports: [],
}
