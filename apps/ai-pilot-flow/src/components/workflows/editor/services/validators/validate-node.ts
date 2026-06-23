import { getWorkflowNodeSchemaForNode } from "@/components/workflows/editor/model/schema/workflow-schema"
import type {
  WorkflowNodeFieldSchema,
  WorkflowNodeValidationRule,
} from "@/components/workflows/editor/model/schema/node-schema"
import { type WorkflowCanvasNode } from "@/components/workflows/editor/model/types/workflow-node"

export type WorkflowValidationLevel = "error" | "warning"

export type WorkflowValidationIssue = {
  level: WorkflowValidationLevel
  code: string
  message: string
  nodeId?: string
}

export type ValidateNodeResult = {
  isValid: boolean
  issues: WorkflowValidationIssue[]
}

function createIssue(
  level: WorkflowValidationLevel,
  code: string,
  message: string,
  nodeId?: string
): WorkflowValidationIssue {
  return {
    level,
    code,
    message,
    nodeId,
  }
}

function isRequiredRuleViolated(
  node: WorkflowCanvasNode,
  fieldSchema: WorkflowNodeFieldSchema,
  rule: WorkflowNodeValidationRule
) {
  if (rule.kind !== "required") {
    return false
  }

  const value = node.data?.[fieldSchema.key]
  return typeof value !== "string" || value.trim().length === 0
}

function validateNodeBySchema(node: WorkflowCanvasNode) {
  const schema = getWorkflowNodeSchemaForNode(node)
  const issues: WorkflowValidationIssue[] = []

  schema.fields.forEach((fieldSchema) => {
    fieldSchema.rules?.forEach((rule) => {
      if (!isRequiredRuleViolated(node, fieldSchema, rule)) {
        return
      }

      issues.push(createIssue(rule.level, rule.code, rule.message, node.id))
    })
  })

  return issues
}

export function validateNode(node: WorkflowCanvasNode): ValidateNodeResult {
  const issues: WorkflowValidationIssue[] = []

  if (!node.id.trim()) {
    issues.push(createIssue("error", "node.id.missing", "Node id is required."))
  }

  if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) {
    issues.push(
      createIssue(
        "error",
        "node.position.invalid",
        "Node position must be a finite number.",
        node.id
      )
    )
  }

  issues.push(...validateNodeBySchema(node))

  return {
    isValid: issues.every((issue) => issue.level !== "error"),
    issues,
  }
}
