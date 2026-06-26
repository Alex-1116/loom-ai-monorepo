import { createImportMultipleLorasNodeData } from "@/components/workflows/editor/model/constants/import-multiple-loras-definitions"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const importMultipleLorasNodeConfig: WorkflowNodeConfig = {
  type: "import-multiple-loras",
  menuLabel: "Import Multiple LoRAs",
  defaults: createImportMultipleLorasNodeData(),
  ports: [],
}
