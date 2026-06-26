import { createExportNodeData } from "@/components/workflows/editor/model/constants/export-definitions"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const exportNodeConfig: WorkflowNodeConfig = {
  type: "export",
  menuLabel: "Export",
  defaults: createExportNodeData(),
  ports: [],
}
