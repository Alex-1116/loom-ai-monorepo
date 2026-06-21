import {
  type WorkflowCanvasNode,
  type WorkflowNodeType,
} from "@/components/workflows/editor/nodes/registry/workflow-node-registry"

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

function validatePromptNode(node: WorkflowCanvasNode) {
  const issues: WorkflowValidationIssue[] = []

  if (!node.data?.title?.trim()) {
    issues.push(
      createIssue(
        "warning",
        "node.prompt.title.missing",
        "Prompt node title is empty.",
        node.id
      )
    )
  }

  if (!node.data?.content?.trim()) {
    issues.push(
      createIssue(
        "warning",
        "node.prompt.content.missing",
        "Prompt node content is empty.",
        node.id
      )
    )
  }

  return issues
}

function validateFileNode(node: WorkflowCanvasNode) {
  const issues: WorkflowValidationIssue[] = []

  if (!node.data?.title?.trim()) {
    issues.push(
      createIssue(
        "warning",
        "node.file.title.missing",
        "File node title is empty.",
        node.id
      )
    )
  }

  return issues
}

function validateExportNode(node: WorkflowCanvasNode) {
  const issues: WorkflowValidationIssue[] = []

  if (!node.data?.title?.trim()) {
    issues.push(
      createIssue(
        "warning",
        "node.export.title.missing",
        "Export node title is empty.",
        node.id
      )
    )
  }

  if (!node.data?.actionLabel?.trim()) {
    issues.push(
      createIssue(
        "warning",
        "node.export.action-label.missing",
        "Export node action label is empty.",
        node.id
      )
    )
  }

  return issues
}

function validateNodeByType(node: WorkflowCanvasNode, type: WorkflowNodeType) {
  switch (type) {
    case "prompt":
      return validatePromptNode(node)
    case "file":
      return validateFileNode(node)
    case "export":
      return validateExportNode(node)
    default:
      return []
  }
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

  issues.push(...validateNodeByType(node, node.type))

  return {
    isValid: issues.every((issue) => issue.level !== "error"),
    issues,
  }
}
