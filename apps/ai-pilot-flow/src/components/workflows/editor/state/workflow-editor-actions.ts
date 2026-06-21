"use client"

import type { ViewportState } from "@/components/workflows/editor/interactions/utils/viewport"
import type { WorkflowCanvasNode } from "@/components/workflows/editor/nodes/registry/workflow-node-registry"
import type { WorkflowEditorHistoryState } from "@/components/workflows/editor/state/workflow-editor-history"

export type WorkflowEditorHistoryMode = "skip" | "deferred" | "commit"

export type WorkflowEditorUpdater<T> = T | ((current: T) => T)

export type WorkflowEditorState = {
  nodes: WorkflowCanvasNode[]
  viewport: ViewportState
  selectedNodeIds: string[]
  history: WorkflowEditorHistoryState
}

export type WorkflowEditorAction =
  | {
      type: "workflow-editor/set-nodes"
      updater: WorkflowEditorUpdater<WorkflowCanvasNode[]>
      historyMode: WorkflowEditorHistoryMode
    }
  | {
      type: "workflow-editor/set-viewport"
      updater: WorkflowEditorUpdater<ViewportState>
      historyMode: WorkflowEditorHistoryMode
    }
  | {
      type: "workflow-editor/set-selected-node-ids"
      nodeIds: string[]
      historyMode: WorkflowEditorHistoryMode
    }
  | {
      type: "workflow-editor/flush-history"
    }
  | {
      type: "workflow-editor/undo"
    }
  | {
      type: "workflow-editor/redo"
    }

export function setWorkflowEditorNodes(
  updater: WorkflowEditorUpdater<WorkflowCanvasNode[]>,
  historyMode: WorkflowEditorHistoryMode = "skip"
): WorkflowEditorAction {
  return {
    type: "workflow-editor/set-nodes",
    updater,
    historyMode,
  }
}

export function setWorkflowEditorViewport(
  updater: WorkflowEditorUpdater<ViewportState>,
  historyMode: WorkflowEditorHistoryMode = "skip"
): WorkflowEditorAction {
  return {
    type: "workflow-editor/set-viewport",
    updater,
    historyMode,
  }
}

export function setWorkflowEditorSelectedNodeIds(
  nodeIds: string[],
  historyMode: WorkflowEditorHistoryMode = "skip"
): WorkflowEditorAction {
  return {
    type: "workflow-editor/set-selected-node-ids",
    nodeIds,
    historyMode,
  }
}

export function flushWorkflowEditorPendingHistory(): WorkflowEditorAction {
  return {
    type: "workflow-editor/flush-history",
  }
}

export function undoWorkflowEditor(): WorkflowEditorAction {
  return {
    type: "workflow-editor/undo",
  }
}

export function redoWorkflowEditor(): WorkflowEditorAction {
  return {
    type: "workflow-editor/redo",
  }
}
