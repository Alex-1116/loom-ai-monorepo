"use client"

import type { WorkflowEditorSnapshot } from "@/components/workflows/editor/model/types/workflow-editor"
import type { WorkflowEdge } from "@/components/workflows/editor/model/types/workflow-edge"
import type { WorkflowCanvasNode } from "@/components/workflows/editor/model/types/workflow-node"

export type WorkflowEditorHistoryState = {
  past: WorkflowEditorSnapshot[]
  future: WorkflowEditorSnapshot[]
  pending: WorkflowEditorSnapshot | null
}

const HISTORY_LIMIT = 100

function cloneEdge(edge: WorkflowEdge): WorkflowEdge {
  return {
    ...edge,
    source: { ...edge.source },
    target: { ...edge.target },
  }
}

function cloneNode(node: WorkflowCanvasNode): WorkflowCanvasNode {
  return {
    ...node,
    data: node.data ? { ...node.data } : undefined,
  }
}

export function cloneWorkflowEditorSnapshot(
  snapshot: WorkflowEditorSnapshot
): WorkflowEditorSnapshot {
  return {
    nodes: snapshot.nodes.map(cloneNode),
    edges: snapshot.edges.map(cloneEdge),
    viewport: { ...snapshot.viewport },
    selectedNodeIds: [...snapshot.selectedNodeIds],
    selectedEdgeIds: [...snapshot.selectedEdgeIds],
  }
}

function areWorkflowNodesEqual(
  left: WorkflowCanvasNode[],
  right: WorkflowCanvasNode[]
) {
  if (left.length !== right.length) {
    return false
  }

  return left.every((node, index) => {
    const other = right[index]
    if (!other) {
      return false
    }

    return (
      node.id === other.id &&
      node.type === other.type &&
      node.x === other.x &&
      node.y === other.y &&
      node.data?.title === other.data?.title &&
      node.data?.content === other.data?.content &&
      node.data?.inputLabel === other.data?.inputLabel &&
      node.data?.actionLabel === other.data?.actionLabel
    )
  })
}

function areStringArraysEqual(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false
  }

  return left.every((value, index) => value === right[index])
}

function areWorkflowEdgesEqual(left: WorkflowEdge[], right: WorkflowEdge[]) {
  if (left.length !== right.length) {
    return false
  }

  return left.every((edge, index) => {
    const other = right[index]
    if (!other) {
      return false
    }

    return (
      edge.id === other.id &&
      edge.source.nodeId === other.source.nodeId &&
      edge.source.side === other.source.side &&
      edge.source.key === other.source.key &&
      edge.target.nodeId === other.target.nodeId &&
      edge.target.side === other.target.side &&
      edge.target.key === other.target.key
    )
  })
}

export function areWorkflowEditorSnapshotsEqual(
  left: WorkflowEditorSnapshot,
  right: WorkflowEditorSnapshot
) {
  return (
    areWorkflowNodesEqual(left.nodes, right.nodes) &&
    areWorkflowEdgesEqual(left.edges, right.edges) &&
    left.viewport.x === right.viewport.x &&
    left.viewport.y === right.viewport.y &&
    left.viewport.scale === right.viewport.scale &&
    areStringArraysEqual(left.selectedNodeIds, right.selectedNodeIds) &&
    areStringArraysEqual(left.selectedEdgeIds, right.selectedEdgeIds)
  )
}

export function createWorkflowEditorHistoryState(): WorkflowEditorHistoryState {
  return {
    past: [],
    future: [],
    pending: null,
  }
}

function trimPastSnapshots(past: WorkflowEditorSnapshot[]) {
  return past.slice(Math.max(0, past.length - HISTORY_LIMIT))
}

export function queueWorkflowEditorHistory(
  history: WorkflowEditorHistoryState,
  currentSnapshot: WorkflowEditorSnapshot
) {
  if (history.pending) {
    return history
  }

  return {
    ...history,
    pending: cloneWorkflowEditorSnapshot(currentSnapshot),
  }
}

export function flushWorkflowEditorHistory(
  history: WorkflowEditorHistoryState,
  currentSnapshot: WorkflowEditorSnapshot
) {
  if (!history.pending) {
    return history
  }

  if (areWorkflowEditorSnapshotsEqual(history.pending, currentSnapshot)) {
    return {
      ...history,
      pending: null,
    }
  }

  return {
    past: trimPastSnapshots([...history.past, history.pending]),
    future: [],
    pending: null,
  }
}

export function pushWorkflowEditorHistory(
  history: WorkflowEditorHistoryState,
  previousSnapshot: WorkflowEditorSnapshot,
  nextSnapshot: WorkflowEditorSnapshot
) {
  if (areWorkflowEditorSnapshotsEqual(previousSnapshot, nextSnapshot)) {
    return flushWorkflowEditorHistory(history, nextSnapshot)
  }

  const flushedHistory = flushWorkflowEditorHistory(history, previousSnapshot)

  return {
    past: trimPastSnapshots([
      ...flushedHistory.past,
      cloneWorkflowEditorSnapshot(previousSnapshot),
    ]),
    future: [],
    pending: null,
  }
}

export function undoWorkflowEditorHistory(
  history: WorkflowEditorHistoryState,
  currentSnapshot: WorkflowEditorSnapshot
) {
  const flushedHistory = flushWorkflowEditorHistory(history, currentSnapshot)
  const previousSnapshot = flushedHistory.past.at(-1)
  if (!previousSnapshot) {
    return null
  }

  return {
    snapshot: cloneWorkflowEditorSnapshot(previousSnapshot),
    history: {
      past: flushedHistory.past.slice(0, -1),
      future: [
        cloneWorkflowEditorSnapshot(currentSnapshot),
        ...flushedHistory.future,
      ],
      pending: null,
    } satisfies WorkflowEditorHistoryState,
  }
}

export function redoWorkflowEditorHistory(
  history: WorkflowEditorHistoryState,
  currentSnapshot: WorkflowEditorSnapshot
) {
  const flushedHistory = flushWorkflowEditorHistory(history, currentSnapshot)
  const nextSnapshot = flushedHistory.future[0]
  if (!nextSnapshot) {
    return null
  }

  return {
    snapshot: cloneWorkflowEditorSnapshot(nextSnapshot),
    history: {
      past: trimPastSnapshots([
        ...flushedHistory.past,
        cloneWorkflowEditorSnapshot(currentSnapshot),
      ]),
      future: flushedHistory.future.slice(1),
      pending: null,
    } satisfies WorkflowEditorHistoryState,
  }
}
