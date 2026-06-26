import { createImportLoraNodeData } from "@/components/workflows/editor/model/constants/import-lora-definitions"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const importLoraNodeConfig: WorkflowNodeConfig = {
  type: "import-lora",
  menuLabel: "Import LoRA",
  defaults: createImportLoraNodeData(),
  ports: [],
}
