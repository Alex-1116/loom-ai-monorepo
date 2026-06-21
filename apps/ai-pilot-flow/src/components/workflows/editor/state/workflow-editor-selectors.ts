"use client"

import type { WorkflowEditorState } from "@/components/workflows/editor/state/workflow-editor-actions"
import { areWorkflowEditorSnapshotsEqual } from "@/components/workflows/editor/state/workflow-editor-history"

function createWorkflowEditorSnapshot(state: WorkflowEditorState) {
  return {
    nodes: state.nodes,
    edges: state.edges,
    viewport: state.viewport,
    selectedNodeIds: state.selectedNodeIds,
    selectedEdgeIds: state.selectedEdgeIds,
  }
}

export function selectWorkflowEditorNodes(state: WorkflowEditorState) {
  return state.nodes
}

export function selectWorkflowEditorViewport(state: WorkflowEditorState) {
  return state.viewport
}

export function selectWorkflowEditorEdges(state: WorkflowEditorState) {
  return state.edges
}

export function selectWorkflowEditorSelectedNodeIds(
  state: WorkflowEditorState
) {
  return state.selectedNodeIds
}

export function selectWorkflowEditorSelectedEdgeIds(
  state: WorkflowEditorState
) {
  return state.selectedEdgeIds
}

export function selectWorkflowEditorCanUndo(state: WorkflowEditorState) {
  if (state.history.past.length > 0) {
    return true
  }

  if (!state.history.pending) {
    return false
  }

  return !areWorkflowEditorSnapshotsEqual(
    state.history.pending,
    createWorkflowEditorSnapshot(state)
  )
}

export function selectWorkflowEditorCanRedo(state: WorkflowEditorState) {
  return state.history.future.length > 0
}
