import { createFileNodeData } from "@/components/workflows/editor/model/constants/file-definitions"
import type { WorkflowNodeConfig } from "@/components/workflows/editor/model/schema/node-schema"

export const fileNodeConfig: WorkflowNodeConfig = {
  type: "file",
  menuLabel: "File",
  defaults: createFileNodeData(),
  ports: [],
}
