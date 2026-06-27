"use client"

import * as React from "react"

import { WorkflowThreeDModelNode } from "@/components/workflows/editor/nodes/blocks/3d-model/workflow-3d-model-node"
import { WorkflowImageModelNode } from "@/components/workflows/editor/nodes/blocks/image-model/workflow-image-model-node"
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

const WORKFLOW_CANVAS_NODE_RENDERERS: Record<
  WorkflowCanvasNode["type"],
  WorkflowCanvasNodeRenderer
> = {
  "image-model": ({
    node,
    isSelected,
    executionStatus,
    onPortPointerDown,
    onRunPreview,
  }) => (
    <WorkflowImageModelNode
      nodeId={node.id}
      isSelected={isSelected}
      executionStatus={executionStatus}
      title={node.data?.title}
      modelKey={node.data?.modelKey}
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
  "video-model": ({
    node,
    isSelected,
    executionStatus,
    onPortPointerDown,
    onRunPreview,
  }) => (
    <WorkflowVideoModelNode
      nodeId={node.id}
      isSelected={isSelected}
      executionStatus={executionStatus}
      title={node.data?.title}
      modelKey={node.data?.modelKey}
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
  "3d-model": ({
    node,
    isSelected,
    executionStatus,
    onPortPointerDown,
    onRunPreview,
  }) => (
    <WorkflowThreeDModelNode
      nodeId={node.id}
      isSelected={isSelected}
      executionStatus={executionStatus}
      title={node.data?.title}
      modelKey={node.data?.modelKey}
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
  tool: ({
    node,
    isSelected,
    executionStatus,
    onPortPointerDown,
    onPatchNode,
    onCommitNodeChanges,
    onRunPreview,
  }) => (
    <WorkflowToolNode
      nodeId={node.id}
      isSelected={isSelected}
      executionStatus={executionStatus}
      toolKey={node.data?.toolKey}
      title={node.data?.title}
      content={node.data?.content}
      toolCategory={node.data?.toolCategory}
      inputPorts={node.data?.inputPorts}
      outputPorts={node.data?.outputPorts}
      addInputLabel={node.data?.addInputLabel}
      runLabel={node.data?.runLabel}
      showAddInputAction={node.data?.showAddInputAction}
      showRunAction={node.data?.showRunAction}
      onPortPointerDown={onPortPointerDown}
      onContentChange={(value) => {
        onPatchNode?.(node.id, {
          content: value,
        })
      }}
      onContentCommit={onCommitNodeChanges}
      onRunClick={() => {
        void onRunPreview()
      }}
    />
  ),
}

export function renderWorkflowCanvasNode(
  params: WorkflowCanvasNodeRendererParams
) {
  return WORKFLOW_CANVAS_NODE_RENDERERS[params.node.type](params)
}
