import { getToolDefinition } from "@/components/workflows/editor/model/constants/tool-definitions"
import type { WorkflowNodeType } from "@/components/workflows/editor/model/types/workflow-node"
import type { WorkflowCanvasNode } from "@/components/workflows/editor/model/types/workflow-node"
import { threeDModelNodeConfig } from "@/components/workflows/editor/nodes/blocks/3d-model/3d-model-node.config"
import { threeDModelNodeSchema } from "@/components/workflows/editor/nodes/blocks/3d-model/3d-model-node.schema"
import { exportNodeConfig } from "@/components/workflows/editor/nodes/blocks/export/export-node.config"
import { exportNodeSchema } from "@/components/workflows/editor/nodes/blocks/export/export-node.schema"
import { fileNodeConfig } from "@/components/workflows/editor/nodes/blocks/file/file-node.config"
import { fileNodeSchema } from "@/components/workflows/editor/nodes/blocks/file/file-node.schema"
import { imageModelNodeConfig } from "@/components/workflows/editor/nodes/blocks/image-model/image-model-node.config"
import { imageModelNodeSchema } from "@/components/workflows/editor/nodes/blocks/image-model/image-model-node.schema"
import { videoModelNodeConfig } from "@/components/workflows/editor/nodes/blocks/video-model/video-model-node.config"
import { videoModelNodeSchema } from "@/components/workflows/editor/nodes/blocks/video-model/video-model-node.schema"
import { importLoraNodeConfig } from "@/components/workflows/editor/nodes/blocks/import-lora/import-lora-node.config"
import { importLoraNodeSchema } from "@/components/workflows/editor/nodes/blocks/import-lora/import-lora-node.schema"
import { importMultipleLorasNodeConfig } from "@/components/workflows/editor/nodes/blocks/import-multiple-loras/import-multiple-loras-node.config"
import { importMultipleLorasNodeSchema } from "@/components/workflows/editor/nodes/blocks/import-multiple-loras/import-multiple-loras-node.schema"
import { previewNodeConfig } from "@/components/workflows/editor/nodes/blocks/preview/preview-node.config"
import { previewNodeSchema } from "@/components/workflows/editor/nodes/blocks/preview/preview-node.schema"
import { promptNodeConfig } from "@/components/workflows/editor/nodes/blocks/prompt/prompt-node.config"
import { promptNodeSchema } from "@/components/workflows/editor/nodes/blocks/prompt/prompt-node.schema"
import { toolNodeConfig } from "@/components/workflows/editor/nodes/blocks/tool/tool-node.config"
import { toolNodeSchema } from "@/components/workflows/editor/nodes/blocks/tool/tool-node.schema"

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
      config: imageModelNodeConfig,
      schema: imageModelNodeSchema,
    },
    {
      config: videoModelNodeConfig,
      schema: videoModelNodeSchema,
    },
    {
      config: threeDModelNodeConfig,
      schema: threeDModelNodeSchema,
    },
    {
      config: toolNodeConfig,
      schema: toolNodeSchema,
    },
    {
      config: exportNodeConfig,
      schema: exportNodeSchema,
    },
    {
      config: previewNodeConfig,
      schema: previewNodeSchema,
    },
    {
      config: importLoraNodeConfig,
      schema: importLoraNodeSchema,
    },
    {
      config: importMultipleLorasNodeConfig,
      schema: importMultipleLorasNodeSchema,
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

export function getWorkflowNodeSchemaForNode(
  node: Pick<WorkflowCanvasNode, "type" | "data">
): WorkflowNodeSchema {
  if (node.type === "tool") {
    const toolSchema = getToolDefinition(node.data?.toolKey)?.schema
    if (toolSchema) {
      return {
        type: "tool",
        fields: toolSchema.fields,
      }
    }
  }

  return getWorkflowNodeSchema(node.type)
}
