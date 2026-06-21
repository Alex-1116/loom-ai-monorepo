"use client"

import * as React from "react"

import type { WorkflowEditorSnapshot } from "@/components/workflows/editor/model/types/workflow-editor"
import {
  flushWorkflowEditorPendingHistory,
  redoWorkflowEditor,
  setWorkflowEditorEdges,
  setWorkflowEditorNodes,
  setWorkflowEditorSelectedEdgeIds,
  setWorkflowEditorSelectedNodeIds,
  setWorkflowEditorViewport,
  type WorkflowEditorAction,
  type WorkflowEditorHistoryMode,
  type WorkflowEditorState,
  type WorkflowEditorUpdater,
  undoWorkflowEditor,
} from "@/components/workflows/editor/state/workflow-editor-actions"
import {
  cloneWorkflowEditorSnapshot,
  createWorkflowEditorHistoryState,
  flushWorkflowEditorHistory,
  pushWorkflowEditorHistory,
  queueWorkflowEditorHistory,
  redoWorkflowEditorHistory,
  undoWorkflowEditorHistory,
} from "@/components/workflows/editor/state/workflow-editor-history"
import {
  selectWorkflowEditorCanRedo,
  selectWorkflowEditorCanUndo,
  selectWorkflowEditorEdges,
  selectWorkflowEditorNodes,
  selectWorkflowEditorSelectedEdgeIds,
  selectWorkflowEditorSelectedNodeIds,
  selectWorkflowEditorViewport,
} from "@/components/workflows/editor/state/workflow-editor-selectors"

function createWorkflowEditorSnapshot(state: WorkflowEditorState) {
  return cloneWorkflowEditorSnapshot({
    nodes: state.nodes,
    edges: state.edges,
    viewport: state.viewport,
    selectedNodeIds: state.selectedNodeIds,
    selectedEdgeIds: state.selectedEdgeIds,
  })
}

function createWorkflowEditorState(
  initialSnapshot: WorkflowEditorSnapshot
): WorkflowEditorState {
  const snapshot = cloneWorkflowEditorSnapshot(initialSnapshot)

  return {
    ...snapshot,
    history: createWorkflowEditorHistoryState(),
  }
}

function resolveUpdater<T>(currentValue: T, updater: WorkflowEditorUpdater<T>) {
  return typeof updater === "function"
    ? (updater as (current: T) => T)(currentValue)
    : updater
}

function applyHistoryMode(
  state: WorkflowEditorState,
  nextSnapshot: WorkflowEditorSnapshot,
  historyMode: WorkflowEditorHistoryMode
) {
  if (historyMode === "skip") {
    return {
      ...state,
      ...nextSnapshot,
    }
  }

  if (historyMode === "deferred") {
    return {
      ...state,
      ...nextSnapshot,
      history: queueWorkflowEditorHistory(
        state.history,
        createWorkflowEditorSnapshot(state)
      ),
    }
  }

  return {
    ...state,
    ...nextSnapshot,
    history: pushWorkflowEditorHistory(
      state.history,
      createWorkflowEditorSnapshot(state),
      nextSnapshot
    ),
  }
}

function workflowEditorReducer(
  state: WorkflowEditorState,
  action: WorkflowEditorAction
): WorkflowEditorState {
  switch (action.type) {
    case "workflow-editor/set-nodes": {
      const nextNodes = resolveUpdater(state.nodes, action.updater)

      return applyHistoryMode(
        state,
        {
          ...createWorkflowEditorSnapshot(state),
          nodes: nextNodes,
        },
        action.historyMode
      )
    }

    case "workflow-editor/set-edges": {
      const nextEdges = resolveUpdater(state.edges, action.updater)

      return applyHistoryMode(
        state,
        {
          ...createWorkflowEditorSnapshot(state),
          edges: nextEdges,
        },
        action.historyMode
      )
    }

    case "workflow-editor/set-viewport": {
      const nextViewport = resolveUpdater(state.viewport, action.updater)

      return applyHistoryMode(
        state,
        {
          ...createWorkflowEditorSnapshot(state),
          viewport: nextViewport,
        },
        action.historyMode
      )
    }

    case "workflow-editor/set-selected-node-ids":
      return applyHistoryMode(
        state,
        {
          ...createWorkflowEditorSnapshot(state),
          selectedNodeIds: [...action.nodeIds],
        },
        action.historyMode
      )

    case "workflow-editor/set-selected-edge-ids":
      return applyHistoryMode(
        state,
        {
          ...createWorkflowEditorSnapshot(state),
          selectedEdgeIds: [...action.edgeIds],
        },
        action.historyMode
      )

    case "workflow-editor/flush-history":
      return {
        ...state,
        history: flushWorkflowEditorHistory(
          state.history,
          createWorkflowEditorSnapshot(state)
        ),
      }

    case "workflow-editor/undo": {
      const result = undoWorkflowEditorHistory(
        state.history,
        createWorkflowEditorSnapshot(state)
      )
      if (!result) {
        return state
      }

      return {
        ...result.snapshot,
        history: result.history,
      }
    }

    case "workflow-editor/redo": {
      const result = redoWorkflowEditorHistory(
        state.history,
        createWorkflowEditorSnapshot(state)
      )
      if (!result) {
        return state
      }

      return {
        ...result.snapshot,
        history: result.history,
      }
    }

    default:
      return state
  }
}

type UseWorkflowEditorStoreParams = {
  initialNodes: WorkflowEditorSnapshot["nodes"]
  initialEdges?: WorkflowEditorSnapshot["edges"]
  initialViewport: WorkflowEditorSnapshot["viewport"]
  initialSelectedNodeIds?: WorkflowEditorSnapshot["selectedNodeIds"]
  initialSelectedEdgeIds?: WorkflowEditorSnapshot["selectedEdgeIds"]
}

export function useWorkflowEditorStore({
  initialNodes,
  initialEdges = [],
  initialViewport,
  initialSelectedNodeIds = [],
  initialSelectedEdgeIds = [],
}: UseWorkflowEditorStoreParams) {
  const [state, dispatch] = React.useReducer(
    workflowEditorReducer,
    {
      nodes: initialNodes,
      edges: initialEdges,
      viewport: initialViewport,
      selectedNodeIds: initialSelectedNodeIds,
      selectedEdgeIds: initialSelectedEdgeIds,
    },
    (initialState) =>
      createWorkflowEditorState({
        nodes: initialState.nodes,
        edges: initialState.edges,
        viewport: initialState.viewport,
        selectedNodeIds: initialState.selectedNodeIds,
        selectedEdgeIds: initialState.selectedEdgeIds,
      })
  )

  const setNodes = React.useCallback(
    (
      updater: WorkflowEditorUpdater<WorkflowEditorState["nodes"]>,
      historyMode: WorkflowEditorHistoryMode = "skip"
    ) => {
      dispatch(setWorkflowEditorNodes(updater, historyMode))
    },
    []
  )

  const setEdges = React.useCallback(
    (
      updater: WorkflowEditorUpdater<WorkflowEditorState["edges"]>,
      historyMode: WorkflowEditorHistoryMode = "skip"
    ) => {
      dispatch(setWorkflowEditorEdges(updater, historyMode))
    },
    []
  )

  const setViewport = React.useCallback(
    (
      updater: WorkflowEditorUpdater<WorkflowEditorState["viewport"]>,
      historyMode: WorkflowEditorHistoryMode = "skip"
    ) => {
      dispatch(setWorkflowEditorViewport(updater, historyMode))
    },
    []
  )

  const setSelectedNodeIds = React.useCallback(
    (nodeIds: string[], historyMode: WorkflowEditorHistoryMode = "skip") => {
      dispatch(setWorkflowEditorSelectedNodeIds(nodeIds, historyMode))
    },
    []
  )

  const setSelectedEdgeIds = React.useCallback(
    (edgeIds: string[], historyMode: WorkflowEditorHistoryMode = "skip") => {
      dispatch(setWorkflowEditorSelectedEdgeIds(edgeIds, historyMode))
    },
    []
  )

  const flushHistory = React.useCallback(() => {
    dispatch(flushWorkflowEditorPendingHistory())
  }, [])

  const undo = React.useCallback(() => {
    dispatch(undoWorkflowEditor())
  }, [])

  const redo = React.useCallback(() => {
    dispatch(redoWorkflowEditor())
  }, [])

  return {
    state,
    nodes: selectWorkflowEditorNodes(state),
    edges: selectWorkflowEditorEdges(state),
    viewport: selectWorkflowEditorViewport(state),
    selectedNodeIds: selectWorkflowEditorSelectedNodeIds(state),
    selectedEdgeIds: selectWorkflowEditorSelectedEdgeIds(state),
    canUndo: selectWorkflowEditorCanUndo(state),
    canRedo: selectWorkflowEditorCanRedo(state),
    setNodes,
    setEdges,
    setViewport,
    setSelectedNodeIds,
    setSelectedEdgeIds,
    flushHistory,
    undo,
    redo,
  }
}
