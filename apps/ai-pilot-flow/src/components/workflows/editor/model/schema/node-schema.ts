import type { WorkflowPortSide } from "@/components/workflows/editor/model/types/workflow-edge"
import type {
  WorkflowNodeData,
  WorkflowNodeType,
} from "@/components/workflows/editor/model/types/workflow-node"

export type WorkflowSchemaValidationLevel = "error" | "warning"

export type WorkflowNodeFieldKey = keyof WorkflowNodeData

export type WorkflowNodeValidationRule = {
  kind: "required"
  level: WorkflowSchemaValidationLevel
  code: string
  message: string
}

export type WorkflowNodeFieldSchema = {
  key: WorkflowNodeFieldKey
  label: string
  input: "text" | "textarea"
  placeholder?: string
  rules?: WorkflowNodeValidationRule[]
}

export type WorkflowNodePortSchema = {
  key: string
  side: WorkflowPortSide
  label?: string
  labelVisibility?: "always" | "hover"
  portToneClassName?: string
  labelToneClassName?: string
}

export type WorkflowNodeConfig = {
  type: WorkflowNodeType
  menuLabel: string
  defaults: WorkflowNodeData
  ports?: WorkflowNodePortSchema[]
}

export type WorkflowNodeSchema = {
  type: WorkflowNodeType
  fields: WorkflowNodeFieldSchema[]
}

export type WorkflowNodeSpec = {
  config: WorkflowNodeConfig
  schema: WorkflowNodeSchema
}
