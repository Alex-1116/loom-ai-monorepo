"use client"

import * as React from "react"

import { WorkflowThreeDModelNode } from "@/components/workflows/editor/nodes/blocks/3d-model/workflow-3d-model-node"
import { WorkflowExportNode } from "@/components/workflows/editor/nodes/blocks/export/workflow-export-node"
import { WorkflowFileNode } from "@/components/workflows/editor/nodes/blocks/file/workflow-file-node"
import { WorkflowImageModelNode } from "@/components/workflows/editor/nodes/blocks/image-model/workflow-image-model-node"
import { WorkflowImportLoraNode } from "@/components/workflows/editor/nodes/blocks/import-lora/workflow-import-lora-node"
import { WorkflowImportMultipleLorasNode } from "@/components/workflows/editor/nodes/blocks/import-multiple-loras/workflow-import-multiple-loras-node"
import { WorkflowPreviewNode } from "@/components/workflows/editor/nodes/blocks/preview/workflow-preview-node"
import { WorkflowPromptNode } from "@/components/workflows/editor/nodes/blocks/prompt/workflow-prompt-node"
import { WorkflowToolNode } from "@/components/workflows/editor/nodes/blocks/tool/workflow-tool-node"
import { WorkflowVideoModelNode } from "@/components/workflows/editor/nodes/blocks/video-model/workflow-video-model-node"
import type { WorkflowCanvasNode } from "@/components/workflows/editor/model/types/workflow-node"
import type { WorkflowNodePortPointerHandler } from "@/components/workflows/editor/nodes/shell/workflow-node-shell"
import type { WorkflowExecutionStatus } from "@/components/workflows/shared/types/workflow-runtime"

type WorkflowCanvasNodeRendererParams = {
  node: WorkflowCanvasNode
  isSelected: boolean
  executionStatus?: WorkflowExecutionStatus
  onPortPointerDown?: WorkflowNodePortPointerHandler
  onRunPreview: () => void | Promise<void>
  onPatchNode?: (
    nodeId: string,
    patch: Partial<NonNullable<WorkflowCanvasNode["data"]>>
  ) => void
  onCommitNodeChanges?: () => void
}

type WorkflowCanvasNodeRenderer = (
  params: WorkflowCanvasNodeRendererParams
) => React.ReactNode

function renderModelNode(
  Component:
    | typeof WorkflowImageModelNode
    | typeof WorkflowVideoModelNode
    | typeof WorkflowThreeDModelNode,
  {
    node,
    isSelected,
    executionStatus,
    onPortPointerDown,
    onRunPreview,
  }: WorkflowCanvasNodeRendererParams
) {
  return (
    <Component
      nodeId={node.id}
      isSelected={isSelected}
      executionStatus={executionStatus}
      title={node.data?.title}
      inputPorts={node.data?.inputPorts}
      outputPorts={node.data?.outputPorts}
      addInputLabel={node.data?.addInputLabel}
      runLabel={node.data?.runLabel}
      showAddInputAction={node.data?.showAddInputAction}
      showRunAction={node.data?.showRunAction}
      onPortPointerDown={onPortPointerDown}
      onRunClick={() => {
        void onRunPreview()
      }}
    />
  )
}

const WORKFLOW_CANVAS_NODE_RENDERERS: Record<
  WorkflowCanvasNode["type"],
  WorkflowCanvasNodeRenderer
> = {
  prompt: ({
    node,
    isSelected,
    executionStatus,
    onPortPointerDown,
    onPatchNode,
    onCommitNodeChanges,
  }) => (
    <WorkflowPromptNode
      nodeId={node.id}
      isSelected={isSelected}
      executionStatus={executionStatus}
      title={node.data?.title}
      content={node.data?.content}
      outputPorts={node.data?.outputPorts}
      addInputLabel={node.data?.addInputLabel}
      showAddInputAction={node.data?.showAddInputAction}
      onPortPointerDown={onPortPointerDown}
      onContentChange={(value) => {
        onPatchNode?.(node.id, {
          content: value,
        })
      }}
      onContentCommit={onCommitNodeChanges}
    />
  ),
  export: ({ node, isSelected, executionStatus, onPortPointerDown }) => (
    <WorkflowExportNode
      nodeId={node.id}
      isSelected={isSelected}
      executionStatus={executionStatus}
      title={node.data?.title}
      inputLabel={node.data?.inputLabel}
      actionLabel={node.data?.actionLabel}
      onPortPointerDown={onPortPointerDown}
    />
  ),
  file: ({ node, isSelected, executionStatus, onPortPointerDown }) => (
    <WorkflowFileNode
      nodeId={node.id}
      isSelected={isSelected}
      executionStatus={executionStatus}
      title={node.data?.title}
      outputPorts={node.data?.outputPorts}
      onPortPointerDown={onPortPointerDown}
    />
  ),
  "image-model": (params) => renderModelNode(WorkflowImageModelNode, params),
  "video-model": (params) => renderModelNode(WorkflowVideoModelNode, params),
  "3d-model": (params) => renderModelNode(WorkflowThreeDModelNode, params),
  tool: ({
    node,
    isSelected,
    executionStatus,
    onPortPointerDown,
    onRunPreview,
  }) => (
    <WorkflowToolNode
      nodeId={node.id}
      isSelected={isSelected}
      executionStatus={executionStatus}
      toolKey={node.data?.toolKey}
      title={node.data?.title}
      toolCategory={node.data?.toolCategory}
      inputPorts={node.data?.inputPorts}
      outputPorts={node.data?.outputPorts}
      addInputLabel={node.data?.addInputLabel}
      runLabel={node.data?.runLabel}
      showAddInputAction={node.data?.showAddInputAction}
      showRunAction={node.data?.showRunAction}
      onPortPointerDown={onPortPointerDown}
      onRunClick={() => {
        void onRunPreview()
      }}
    />
  ),
  preview: ({ node, isSelected, executionStatus, onPortPointerDown }) => (
    <WorkflowPreviewNode
      nodeId={node.id}
      isSelected={isSelected}
      executionStatus={executionStatus}
      title={node.data?.title}
      inputLabel={node.data?.inputLabel}
      onPortPointerDown={onPortPointerDown}
    />
  ),
  "import-lora": ({ node, isSelected, executionStatus, onPortPointerDown }) => (
    <WorkflowImportLoraNode
      nodeId={node.id}
      isSelected={isSelected}
      executionStatus={executionStatus}
      title={node.data?.title}
      outputLabel={node.data?.outputLabel}
      onPortPointerDown={onPortPointerDown}
    />
  ),
  "import-multiple-loras": ({
    node,
    isSelected,
    executionStatus,
    onPortPointerDown,
  }) => (
    <WorkflowImportMultipleLorasNode
      nodeId={node.id}
      isSelected={isSelected}
      executionStatus={executionStatus}
      title={node.data?.title}
      outputLabel={node.data?.outputLabel}
      secondaryOutputLabel={node.data?.secondaryOutputLabel}
      onPortPointerDown={onPortPointerDown}
    />
  ),
}

export function renderWorkflowCanvasNode(
  params: WorkflowCanvasNodeRendererParams
) {
  return WORKFLOW_CANVAS_NODE_RENDERERS[params.node.type](params)
}
