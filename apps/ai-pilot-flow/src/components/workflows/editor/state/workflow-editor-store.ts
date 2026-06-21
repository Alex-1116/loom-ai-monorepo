"use client"

import * as React from "react"

import {
  flushWorkflowEditorPendingHistory,
  redoWorkflowEditor,
  setWorkflowEditorNodes,
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
  type WorkflowEditorSnapshot,
} from "@/components/workflows/editor/state/workflow-editor-history"
import {
  selectWorkflowEditorCanRedo,
  selectWorkflowEditorCanUndo,
  selectWorkflowEditorNodes,
  selectWorkflowEditorSelectedNodeIds,
  selectWorkflowEditorViewport,
} from "@/components/workflows/editor/state/workflow-editor-selectors"

function createWorkflowEditorSnapshot(state: WorkflowEditorState) {
  return cloneWorkflowEditorSnapshot({
    nodes: state.nodes,
    viewport: state.viewport,
    selectedNodeIds: state.selectedNodeIds,
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
  initialViewport: WorkflowEditorSnapshot["viewport"]
  initialSelectedNodeIds?: WorkflowEditorSnapshot["selectedNodeIds"]
}

export function useWorkflowEditorStore({
  initialNodes,
  initialViewport,
  initialSelectedNodeIds = [],
}: UseWorkflowEditorStoreParams) {
  const [state, dispatch] = React.useReducer(
    workflowEditorReducer,
    {
      nodes: initialNodes,
      viewport: initialViewport,
      selectedNodeIds: initialSelectedNodeIds,
    },
    (initialState) =>
      createWorkflowEditorState({
        nodes: initialState.nodes,
        viewport: initialState.viewport,
        selectedNodeIds: initialState.selectedNodeIds,
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
    viewport: selectWorkflowEditorViewport(state),
    selectedNodeIds: selectWorkflowEditorSelectedNodeIds(state),
    canUndo: selectWorkflowEditorCanUndo(state),
    canRedo: selectWorkflowEditorCanRedo(state),
    setNodes,
    setViewport,
    setSelectedNodeIds,
    flushHistory,
    undo,
    redo,
  }
}
