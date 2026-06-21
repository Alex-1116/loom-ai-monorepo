import type { WorkflowNodeType } from "@/components/workflows/editor/model/types/workflow-node"
import { exportNodeConfig } from "@/components/workflows/editor/nodes/blocks/export/export-node.config"
import { exportNodeSchema } from "@/components/workflows/editor/nodes/blocks/export/export-node.schema"
import { fileNodeConfig } from "@/components/workflows/editor/nodes/blocks/file/file-node.config"
import { fileNodeSchema } from "@/components/workflows/editor/nodes/blocks/file/file-node.schema"
import { previewNodeConfig } from "@/components/workflows/editor/nodes/blocks/preview/preview-node.config"
import { previewNodeSchema } from "@/components/workflows/editor/nodes/blocks/preview/preview-node.schema"
import { promptNodeConfig } from "@/components/workflows/editor/nodes/blocks/prompt/prompt-node.config"
import { promptNodeSchema } from "@/components/workflows/editor/nodes/blocks/prompt/prompt-node.schema"

import type {
  WorkflowNodeConfig,
  WorkflowNodeSchema,
  WorkflowNodeSpec,
} from "@/components/workflows/editor/model/schema/node-schema"

export type WorkflowSchema = {
  nodes: WorkflowNodeSpec[]
}

export const workflowSchema: WorkflowSchema = {
  nodes: [
    {
      config: promptNodeConfig,
      schema: promptNodeSchema,
    },
    {
      config: fileNodeConfig,
      schema: fileNodeSchema,
    },
    {
      config: exportNodeConfig,
      schema: exportNodeSchema,
    },
    {
      config: previewNodeConfig,
      schema: previewNodeSchema,
    },
  ],
}

const workflowNodeSpecRegistry = new Map<WorkflowNodeType, WorkflowNodeSpec>(
  workflowSchema.nodes.map((nodeSpec) => [nodeSpec.config.type, nodeSpec])
)

export function getWorkflowNodeSpec(type: WorkflowNodeType) {
  const spec = workflowNodeSpecRegistry.get(type)

  if (!spec) {
    throw new Error(`Unknown workflow node type: ${type}`)
  }

  return spec
}

export function getWorkflowNodeConfig(
  type: WorkflowNodeType
): WorkflowNodeConfig {
  return getWorkflowNodeSpec(type).config
}

export function getWorkflowNodeSchema(
  type: WorkflowNodeType
): WorkflowNodeSchema {
  return getWorkflowNodeSpec(type).schema
}
