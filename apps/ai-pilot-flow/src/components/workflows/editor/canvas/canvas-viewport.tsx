"use client"

import * as React from "react"

import { cn } from "@loom/ui/lib/utils"

import {
  WorkflowCanvasBottomToolbar,
  type WorkflowCanvasTool,
} from "@/components/workflows/editor/chrome/toolbar/canvas-bottom-toolbar"
import { WorkflowCanvasViewToolbar } from "@/components/workflows/editor/chrome/toolbar/canvas-view-toolbar"
import { WorkflowCanvasBackground } from "@/components/workflows/editor/canvas/canvas-background"
import { WorkflowCanvasContextMenu } from "@/components/workflows/editor/canvas/canvas-context-menu"
import {
  WorkflowCanvasEdgesLayer,
  type WorkflowEdgeExecutionStatus,
} from "@/components/workflows/editor/canvas/canvas-edges-layer"
import { WorkflowCanvasGuidesLayer } from "@/components/workflows/editor/canvas/canvas-guides-layer"
import { WorkflowCanvasSelectionLayer } from "@/components/workflows/editor/canvas/canvas-selection-layer"
import { WorkflowCanvasLeftToolbar } from "@/components/workflows/editor/chrome/toolbar/canvas-left-toolbar"
import { WorkflowNodeInspectorPanel } from "@/components/workflows/editor/chrome/panels/node-inspector-panel"
import { WorkflowOutlinePanel } from "@/components/workflows/editor/chrome/panels/workflow-outline-panel"
import { WorkflowRunPreviewPanel } from "@/components/workflows/editor/chrome/panels/workflow-run-preview-panel"
import { WorkflowEmptyState } from "@/components/workflows/editor/chrome/overlays/empty-state"
import { WorkflowZoomIndicator } from "@/components/workflows/editor/chrome/overlays/zoom-indicator"
import { type WorkflowCanvasNode } from "@/components/workflows/editor/model/types/workflow-node"
import { autoLayout } from "@/components/workflows/editor/services/layout/auto-layout"
import { deserializeWorkflow } from "@/components/workflows/editor/services/serializer/deserialize-workflow"
import { serializeWorkflow } from "@/components/workflows/editor/services/serializer/serialize-workflow"
import { validateWorkflow } from "@/components/workflows/editor/services/validators/validate-workflow"
import {
  createInitialWorkflowNodes,
  createWorkflowNode,
} from "@/components/workflows/editor/nodes/registry/workflow-node-factory"
import {
  createToolNodeData,
  getToolDefinition,
} from "@/components/workflows/editor/model/constants/tool-definitions"
import { renderWorkflowCanvasNode } from "@/components/workflows/editor/nodes/registry/workflow-canvas-node-renderers"
import { useCanvasPan } from "@/components/workflows/editor/interactions/hooks/useCanvasPan"
import { useCanvasNodeDrag } from "@/components/workflows/editor/interactions/hooks/useCanvasNodeDrag"
import { useCanvasNodeMeasurements } from "@/components/workflows/editor/interactions/hooks/useCanvasNodeMeasurements"
import { useCanvasSnapping } from "@/components/workflows/editor/interactions/hooks/useCanvasSnapping"
import { useCanvasViewportControls } from "@/components/workflows/editor/interactions/hooks/useCanvasViewportControls"
import {
  getElementRelativePoint,
  getElementSize,
} from "@/components/workflows/editor/interactions/utils/pointer"
import { getSurfaceCenter } from "@/components/workflows/editor/interactions/utils/viewport"
import { useCanvasZoom } from "@/components/workflows/editor/interactions/hooks/useCanvasZoom"
import { useWorkflowEditorStore } from "@/components/workflows/editor/state/workflow-editor-store"
import { useCanvasSelection } from "@/components/workflows/editor/interactions/hooks/useCanvasSelection"
import { useCanvasSelectionDrag } from "@/components/workflows/editor/interactions/hooks/useCanvasSelectionDrag"
import { useCanvasEdgeConnection } from "@/components/workflows/editor/interactions/hooks/useCanvasEdgeConnection"
import { runWorkflowDocument } from "@/components/workflows/runtime"
import type {
  WorkflowNodeExecutionState,
  WorkflowRunResult,
} from "@/components/workflows/shared"

type WorkflowCanvasNodeSize = {
  width: number
  height: number
}

const initialNodes = createInitialWorkflowNodes()
const SELECTION_OVERLAY_PADDING = 5
const NODE_SUCCESS_RESET_DELAY_MS = 1200

function formatZoom(scale: number) {
  return `${Math.round(scale * 100)}%`
}

function formatWorkflowValidationErrors(errorMessages: string[]) {
  return [
    "运行前校验未通过：",
    ...errorMessages.map((message) => `- ${message}`),
  ].join("\n")
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return Boolean(
    target.closest(
      'input, textarea, select, [contenteditable="true"], [role="textbox"]'
    )
  )
}

export function WorkflowCanvasViewport() {
  const surfaceRef = React.useRef<HTMLDivElement | null>(null)
  const importInputRef = React.useRef<HTMLInputElement | null>(null)
  const nodesRef = React.useRef<WorkflowCanvasNode[]>(initialNodes)
  const nodeSizesRef = React.useRef<Record<string, WorkflowCanvasNodeSize>>({})
  const edgeResetTimersRef = React.useRef<Record<string, number>>({})
  const nodeResetTimersRef = React.useRef<Record<string, number>>({})
  const [activeTool, setActiveTool] =
    React.useState<WorkflowCanvasTool>("select")
  const [isRunningPreview, setIsRunningPreview] = React.useState(false)
  const [isOutlineVisible, setIsOutlineVisible] = React.useState(false)
  const [runPreviewResult, setRunPreviewResult] =
    React.useState<WorkflowRunResult | null>(null)
  const [runPreviewError, setRunPreviewError] = React.useState<string | null>(
    null
  )
  const [nodeExecutionStates, setNodeExecutionStates] = React.useState<
    Record<string, WorkflowNodeExecutionState>
  >({})
  const [edgeExecutionStatuses, setEdgeExecutionStatuses] = React.useState<
    Record<string, WorkflowEdgeExecutionStatus>
  >({})
  const {
    nodes,
    edges,
    viewport,
    selectedNodeIds,
    selectedEdgeIds,
    canUndo,
    canRedo,
    replaceDocument,
    setNodes,
    setEdges,
    setViewport,
    setSelectedEdgeIds,
    setSelectedNodeIds,
    flushHistory,
    undo,
    redo,
  } = useWorkflowEditorStore({
    initialNodes,
    initialViewport: {
      x: 0,
      y: 0,
      scale: 1,
    },
  })
  const { nodeSizes, portAnchors, handleNodeElementRef } =
    useCanvasNodeMeasurements({
      nodes,
    })
  const selectedNodeIdSet = React.useMemo(
    () => new Set(selectedNodeIds),
    [selectedNodeIds]
  )
  const selectedNode = React.useMemo(() => {
    if (selectedNodeIds.length !== 1) {
      return null
    }

    return nodes.find((node) => node.id === selectedNodeIds[0]) ?? null
  }, [nodes, selectedNodeIds])

  const setNodesTransient = React.useCallback(
    (updater: React.SetStateAction<WorkflowCanvasNode[]>) => {
      setNodes(updater, "deferred")
    },
    [setNodes]
  )

  const setNodesCommitted = React.useCallback(
    (updater: React.SetStateAction<WorkflowCanvasNode[]>) => {
      setNodes(updater, "commit")
    },
    [setNodes]
  )

  const setViewportTransient = React.useCallback(
    (
      updater: React.SetStateAction<{
        x: number
        y: number
        scale: number
      }>
    ) => {
      setViewport(updater, "deferred")
    },
    [setViewport]
  )

  const setViewportCommitted = React.useCallback(
    (
      updater: React.SetStateAction<{
        x: number
        y: number
        scale: number
      }>
    ) => {
      setViewport(updater, "commit")
    },
    [setViewport]
  )

  React.useEffect(() => {
    // 拖拽和吸附逻辑依赖最新节点数据，但不希望因为闭包导致频繁重绑事件。
    nodesRef.current = nodes
  }, [nodes])

  React.useEffect(() => {
    // 节点尺寸由独立 hook 维护，这里只同步给吸附层读取。
    nodeSizesRef.current = nodeSizes
  }, [nodeSizes])

  const clearEdgeExecutionTimers = React.useCallback(() => {
    Object.values(edgeResetTimersRef.current).forEach((timerId) => {
      window.clearTimeout(timerId)
    })
    edgeResetTimersRef.current = {}
  }, [])

  const clearNodeExecutionTimers = React.useCallback(() => {
    Object.values(nodeResetTimersRef.current).forEach((timerId) => {
      window.clearTimeout(timerId)
    })
    nodeResetTimersRef.current = {}
  }, [])

  const resetEdgeExecutionStatuses = React.useCallback(() => {
    clearEdgeExecutionTimers()
    setEdgeExecutionStatuses({})
  }, [clearEdgeExecutionTimers])

  const resetNodeExecutionStates = React.useCallback(() => {
    clearNodeExecutionTimers()
    setNodeExecutionStates({})
  }, [clearNodeExecutionTimers])

  const clearNodeExecutionResetTimer = React.useCallback((nodeId: string) => {
    const timerId = nodeResetTimersRef.current[nodeId]
    if (!timerId) {
      return
    }

    window.clearTimeout(timerId)
    delete nodeResetTimersRef.current[nodeId]
  }, [])

  const scheduleNodeExecutionReset = React.useCallback(
    (nodeId: string) => {
      clearNodeExecutionResetTimer(nodeId)
      nodeResetTimersRef.current[nodeId] = window.setTimeout(() => {
        setNodeExecutionStates((current) => {
          if (!(nodeId in current)) {
            return current
          }

          const next = { ...current }
          delete next[nodeId]
          return next
        })
        delete nodeResetTimersRef.current[nodeId]
      }, NODE_SUCCESS_RESET_DELAY_MS)
    },
    [clearNodeExecutionResetTimer]
  )

  React.useEffect(() => {
    return () => {
      clearEdgeExecutionTimers()
      clearNodeExecutionTimers()
    }
  }, [clearEdgeExecutionTimers, clearNodeExecutionTimers])

  const markIncomingEdgesExecutionStatus = React.useCallback(
    (nodeId: string, status: WorkflowEdgeExecutionStatus) => {
      const incomingEdgeIds = edges
        .filter((edge) => edge.target.nodeId === nodeId)
        .map((edge) => edge.id)

      if (incomingEdgeIds.length === 0) {
        return
      }

      setEdgeExecutionStatuses((current) => {
        const next = { ...current }
        incomingEdgeIds.forEach((edgeId) => {
          next[edgeId] = status
        })
        return next
      })

      incomingEdgeIds.forEach((edgeId) => {
        const existingTimerId = edgeResetTimersRef.current[edgeId]
        if (existingTimerId) {
          window.clearTimeout(existingTimerId)
          delete edgeResetTimersRef.current[edgeId]
        }

        if (status === "flowing") {
          return
        }

        edgeResetTimersRef.current[edgeId] = window.setTimeout(() => {
          setEdgeExecutionStatuses((current) => {
            if (!(edgeId in current)) {
              return current
            }

            const next = { ...current }
            delete next[edgeId]
            return next
          })
          delete edgeResetTimersRef.current[edgeId]
        }, 640)
      })
    },
    [edges]
  )

  const {
    guides: activeSnapGuides,
    clearGuides,
    handleNodePositionChange,
  } = useCanvasSnapping({
    viewport,
    nodesRef,
    nodeSizesRef,
    setNodes: setNodesTransient,
  })

  const {
    isSelectionOverlayVisible,
    selectionBox,
    handleSelectionPointerDown,
    handleSelectionPointerMove,
    handleSelectionPointerEnd,
  } = useCanvasSelection({
    surfaceRef,
    activeTool,
    viewport,
    nodesRef,
    nodeSizesRef,
    selectedNodeIds,
    setSelectedNodeIds,
    clearSecondarySelection: () => setSelectedEdgeIds([]),
  })

  const persistedSelectionOverlayBox = React.useMemo(() => {
    const surfaceSize = getElementSize(surfaceRef.current)
    if (!surfaceSize || selectedNodeIdSet.size === 0) {
      return null
    }

    const center = getSurfaceCenter(surfaceSize)
    const safeScale = Math.max(viewport.scale, 0.01)
    const selectedNodeBounds = nodes.flatMap((node) => {
      if (!selectedNodeIdSet.has(node.id)) {
        return []
      }

      const nodeSize = nodeSizes[node.id]
      if (!nodeSize) {
        return []
      }

      return [
        {
          left: center.x + viewport.x + node.x * safeScale,
          top: center.y + viewport.y + node.y * safeScale,
          width: nodeSize.width * safeScale,
          height: nodeSize.height * safeScale,
        },
      ]
    })

    if (selectedNodeBounds.length === 0) {
      return null
    }

    const left = Math.min(...selectedNodeBounds.map((node) => node.left))
    const top = Math.min(...selectedNodeBounds.map((node) => node.top))
    const right = Math.max(
      ...selectedNodeBounds.map((node) => node.left + node.width)
    )
    const bottom = Math.max(
      ...selectedNodeBounds.map((node) => node.top + node.height)
    )

    return {
      left: left - SELECTION_OVERLAY_PADDING,
      top: top - SELECTION_OVERLAY_PADDING,
      width: right - left + SELECTION_OVERLAY_PADDING * 2,
      height: bottom - top + SELECTION_OVERLAY_PADDING * 2,
    }
  }, [
    nodeSizes,
    nodes,
    selectedNodeIdSet,
    viewport.scale,
    viewport.x,
    viewport.y,
  ])

  const { draggingNodeId, handleNodePointerDown } = useCanvasNodeDrag({
    scale: viewport.scale,
    onNodePositionChange: handleNodePositionChange,
    onDragEnd: () => {
      flushHistory()
      clearGuides()
    },
  })
  const { isDraggingSelection, handleSelectionDragPointerDown } =
    useCanvasSelectionDrag({
      activeTool,
      scale: viewport.scale,
      selectedNodeIds,
      nodesRef,
      setNodes: setNodesTransient,
      onDragEnd: () => {
        flushHistory()
        clearGuides()
      },
    })
  const {
    hasActiveConnection,
    previewConnection,
    handlePortPointerDown,
    handleEdgeReconnectPointerDown,
    cancelConnection,
  } = useCanvasEdgeConnection({
    surfaceRef,
    viewport,
    edges,
    setEdges,
    setSelectedEdgeIds,
  })

  const {
    handleTouchPointerDown,
    handleTouchPointerMove,
    handleTouchPointerEnd,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleZoomFit,
  } = useCanvasZoom({
    surfaceRef,
    viewport,
    setViewport: setViewportTransient,
    commitViewport: setViewportCommitted,
  })

  const { isPanning, handlePointerDown, handlePointerMove, handlePointerEnd } =
    useCanvasPan({
      activeTool,
      viewport,
      setViewport: setViewportTransient,
      handleTouchPointerDown,
      handleTouchPointerMove,
      handleTouchPointerEnd,
    })

  const { handleResetView } = useCanvasViewportControls({
    setViewport: setViewportCommitted,
    clearGuides,
  })

  const handleCreateNodeFromMenu = React.useCallback(
    (payload: {
      type: WorkflowCanvasNode["type"]
      data?: Partial<NonNullable<WorkflowCanvasNode["data"]>>
      clientX: number
      clientY: number
    }) => {
      const surfaceSize = getElementSize(surfaceRef.current)
      const surfacePoint = getElementRelativePoint(surfaceRef.current, payload)
      if (!surfaceSize || !surfacePoint) {
        return
      }

      const safeScale = Math.max(viewport.scale, 0.01)
      // 右键菜单拿到的是屏幕坐标，这里需要反算成画布世界坐标再创建节点。
      const x =
        (surfacePoint.x - surfaceSize.width / 2 - viewport.x) / safeScale
      const y =
        (surfacePoint.y - surfaceSize.height / 2 - viewport.y) / safeScale

      setNodesCommitted((current) => [
        ...current,
        createWorkflowNode({
          type: payload.type,
          x,
          y,
          data: payload.data,
        }),
      ])
      clearGuides()
    },
    [clearGuides, setNodesCommitted, viewport.scale, viewport.x, viewport.y]
  )

  const handlePatchNode = React.useCallback(
    (
      nodeId: string,
      patch: Partial<NonNullable<WorkflowCanvasNode["data"]>>
    ) => {
      setNodesTransient((current) =>
        current.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...patch,
                },
              }
            : node
        )
      )
    },
    [setNodesTransient]
  )

  const handleCreateFirstNode = React.useCallback(() => {
    setNodesCommitted((current) => {
      if (current.length > 0) {
        return current
      }

      return [
        createWorkflowNode({
          type: "tool",
          x: 0,
          y: 0,
          data: createToolNodeData(getToolDefinition("prompt")!),
        }),
      ]
    })
    clearGuides()
  }, [clearGuides, setNodesCommitted])

  const handleSelectEdge = React.useCallback(
    (edgeId: string) => {
      setSelectedNodeIds([])
      setSelectedEdgeIds([edgeId])
    },
    [setSelectedEdgeIds, setSelectedNodeIds]
  )

  const handleAutoLayout = React.useCallback(() => {
    if (nodes.length === 0) {
      return
    }

    setNodes(
      (current) =>
        autoLayout(current, {
          direction: "horizontal",
          startX: 0,
          startY: 0,
          edges,
        }),
      "commit"
    )
    setSelectedEdgeIds([])
    clearGuides()
  }, [clearGuides, edges, nodes.length, setNodes, setSelectedEdgeIds])

  const handleExportJson = React.useCallback(() => {
    const serialized = serializeWorkflow({
      nodes,
      edges,
      viewport,
    })
    const blob = new Blob([serialized], { type: "application/json" })
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement("a")
    const fileTimestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-")

    link.href = objectUrl
    link.download = `workflow-${fileTimestamp}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(objectUrl)
  }, [edges, nodes, viewport])

  const handleRunPreview = React.useCallback(async () => {
    if (nodes.length === 0 || isRunningPreview) {
      return
    }

    const validation = validateWorkflow({
      nodes,
      edges,
      viewport,
    })
    const validationErrors = validation.issues
      .filter((issue) => issue.level === "error")
      .map((issue) => issue.message)

    setIsRunningPreview(true)
    setRunPreviewResult(null)
    setRunPreviewError(null)
    resetNodeExecutionStates()
    resetEdgeExecutionStatuses()

    try {
      if (validationErrors.length > 0) {
        setRunPreviewError(formatWorkflowValidationErrors(validationErrors))
        return
      }

      const result = await runWorkflowDocument({
        document: {
          nodes,
          edges,
        },
        onNodeStateChange: (nodeState) => {
          clearNodeExecutionResetTimer(nodeState.nodeId)
          setNodeExecutionStates((current) => ({
            ...current,
            [nodeState.nodeId]: nodeState,
          }))

          if (nodeState.status === "running") {
            markIncomingEdgesExecutionStatus(nodeState.nodeId, "flowing")
            return
          }

          if (
            nodeState.status === "succeeded" ||
            nodeState.status === "failed"
          ) {
            markIncomingEdgesExecutionStatus(nodeState.nodeId, nodeState.status)
          }

          if (nodeState.status === "succeeded") {
            scheduleNodeExecutionReset(nodeState.nodeId)
          }
        },
      })

      setRunPreviewResult(result)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "运行预览时发生未知错误。"
      setRunPreviewResult(null)
      setRunPreviewError(message)
    } finally {
      setIsRunningPreview(false)
    }
  }, [
    edges,
    isRunningPreview,
    clearNodeExecutionResetTimer,
    markIncomingEdgesExecutionStatus,
    nodes,
    resetNodeExecutionStates,
    scheduleNodeExecutionReset,
    resetEdgeExecutionStatuses,
    viewport,
  ])

  const handleTriggerImport = React.useCallback(() => {
    if (!importInputRef.current) {
      return
    }

    importInputRef.current.value = ""
    importInputRef.current.click()
  }, [])

  const handleImportJson = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      event.target.value = ""
      if (!file) {
        return
      }

      try {
        const rawText = await file.text()
        const document = deserializeWorkflow(rawText)
        const validation = validateWorkflow({
          nodes: document.nodes,
          edges: document.edges,
          viewport: document.viewport,
        })

        if (!validation.isValid) {
          const errorMessages = validation.issues
            .filter((issue) => issue.level === "error")
            .map((issue) => `- ${issue.message}`)
            .join("\n")

          window.alert(`导入失败，工作流校验未通过：\n${errorMessages}`)
          return
        }

        replaceDocument({
          nodes: document.nodes,
          edges: document.edges,
          viewport: document.viewport,
          selectedNodeIds: [],
          selectedEdgeIds: [],
        })
        clearGuides()
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "无法解析所选 JSON 文件。"
        window.alert(`导入失败：${message}`)
      }
    },
    [clearGuides, replaceDocument]
  )

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isEditableTarget(event.target)) {
        if (hasActiveConnection) {
          cancelConnection()
          event.preventDefault()
          return
        }

        if (selectedNodeIds.length > 0 || selectedEdgeIds.length > 0) {
          setSelectedNodeIds([])
          setSelectedEdgeIds([])
          event.preventDefault()
        }
        return
      }

      if (
        (event.key !== "Backspace" && event.key !== "Delete") ||
        isEditableTarget(event.target)
      ) {
        return
      }

      if (selectedEdgeIds.length > 0) {
        const selectedEdgeIdSet = new Set(selectedEdgeIds)
        setEdges(
          (current) =>
            current.filter((edge) => !selectedEdgeIdSet.has(edge.id)),
          "commit"
        )
        setSelectedEdgeIds([])
        event.preventDefault()
        return
      }

      if (selectedNodeIds.length === 0) {
        return
      }

      const selectedNodeIdSet = new Set(selectedNodeIds)
      setNodes(
        (current) => current.filter((node) => !selectedNodeIdSet.has(node.id)),
        "commit"
      )
      setEdges(
        (current) =>
          current.filter(
            (edge) =>
              !selectedNodeIdSet.has(edge.source.nodeId) &&
              !selectedNodeIdSet.has(edge.target.nodeId)
          ),
        "skip"
      )
      setSelectedNodeIds([])
      setSelectedEdgeIds([])
      event.preventDefault()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    cancelConnection,
    hasActiveConnection,
    selectedEdgeIds,
    selectedNodeIds,
    setEdges,
    setNodes,
    setSelectedEdgeIds,
    setSelectedNodeIds,
  ])

  return (
    <WorkflowCanvasContextMenu
      className="absolute inset-0 z-10"
      onSelectItem={handleCreateNodeFromMenu}
    >
      <div
        ref={surfaceRef}
        className={cn(
          "relative h-full w-full touch-none overflow-hidden overscroll-none",
          activeTool === "hand" && !isPanning && "cursor-grab",
          activeTool === "hand" && isPanning && "cursor-grabbing",
          isDraggingSelection && "cursor-grabbing",
          draggingNodeId && "cursor-grabbing",
          selectionBox && "cursor-crosshair"
        )}
        onPointerDown={(event) => {
          if (handleSelectionPointerDown(event)) {
            return
          }

          if (
            !(event.target as HTMLElement).closest("[data-workflow-edge-hit]")
          ) {
            setSelectedEdgeIds([])
          }

          handlePointerDown(event)
        }}
        onPointerMove={(event) => {
          if (handleSelectionPointerMove(event)) {
            return
          }

          handlePointerMove(event)
        }}
        onPointerUp={(event) => {
          if (handleSelectionPointerEnd(event)) {
            return
          }

          handlePointerEnd(event)
          flushHistory()
        }}
        onPointerCancel={(event) => {
          if (handleSelectionPointerEnd(event)) {
            return
          }

          handlePointerEnd(event)
          flushHistory()
        }}
      >
        <WorkflowCanvasBackground viewport={viewport} />
        <WorkflowCanvasGuidesLayer
          guides={activeSnapGuides}
          viewport={viewport}
        />
        <div
          className="absolute inset-y-0 left-4 z-20 hidden items-center xl:flex"
          data-workflow-overlay
        >
          <WorkflowCanvasLeftToolbar />
        </div>

        <div
          className="absolute top-4 left-4 z-20 hidden xl:block"
          data-workflow-overlay
        >
          <WorkflowCanvasViewToolbar
            isOutlineVisible={isOutlineVisible}
            onToggleOutline={() => setIsOutlineVisible((current) => !current)}
          />
        </div>

        {isOutlineVisible ? (
          <div
            className="absolute top-4 bottom-4 left-20 z-20 hidden origin-top-left animate-in duration-200 ease-out zoom-in-95 fade-in xl:block"
            data-workflow-overlay
          >
            <WorkflowOutlinePanel
              nodes={nodes}
              selectedNodeIds={selectedNodeIds}
              onSelectNode={(nodeId) => {
                setSelectedEdgeIds([])
                setSelectedNodeIds([nodeId])
              }}
            />
          </div>
        ) : null}

        <div
          className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2"
          data-workflow-overlay
        >
          <WorkflowCanvasBottomToolbar
            activeTool={activeTool}
            zoomLabel={formatZoom(viewport.scale)}
            onToolChange={setActiveTool}
            onImportJson={handleTriggerImport}
            onExportJson={handleExportJson}
            onRunPreview={handleRunPreview}
            onAutoLayout={handleAutoLayout}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onZoomReset={handleZoomReset}
            onZoomFit={handleZoomFit}
            onResetView={handleResetView}
            onUndo={() => {
              undo()
              clearGuides()
            }}
            onRedo={() => {
              redo()
              clearGuides()
            }}
            canUndo={canUndo}
            canRedo={canRedo}
            canRunPreview={nodes.length > 0}
            isRunningPreview={isRunningPreview}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-40 p-4"
          data-workflow-overlay
        >
          <WorkflowRunPreviewPanel
            isRunning={isRunningPreview}
            result={runPreviewResult}
            errorMessage={runPreviewError}
            onClose={() => {
              setIsRunningPreview(false)
              setRunPreviewResult(null)
              setRunPreviewError(null)
              resetNodeExecutionStates()
              resetEdgeExecutionStatuses()
            }}
          />
        </div>

        {selectedNodeIds.length > 0 ? (
          <div
            className="absolute top-4 right-4 bottom-4 z-20 hidden animate-in duration-200 ease-out fade-in slide-in-from-right-4 xl:block"
            data-workflow-overlay
          >
            <WorkflowNodeInspectorPanel
              selectedCount={selectedNodeIds.length}
              selectedNode={selectedNode}
              onPatchNode={handlePatchNode}
              onCommitChanges={flushHistory}
            />
          </div>
        ) : null}

        <WorkflowEmptyState
          visible={nodes.length === 0}
          onCreateFirstNode={handleCreateFirstNode}
        />
        <WorkflowZoomIndicator scale={viewport.scale} />
        <input
          ref={importInputRef}
          accept="application/json,.json"
          className="hidden"
          type="file"
          onChange={handleImportJson}
        />

        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 will-change-transform"
            style={{
              // 画布世界原点固定在屏幕中心，再叠加 viewport 做平移和缩放。
              transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
              transformOrigin: "0 0",
            }}
          >
            <div className="relative h-0 w-0">
              <WorkflowCanvasEdgesLayer
                nodes={nodes}
                nodeSizes={nodeSizes}
                portAnchors={portAnchors}
                edges={edges}
                edgeExecutionStatuses={edgeExecutionStatuses}
                selectedEdgeIds={selectedEdgeIds}
                onSelectEdge={handleSelectEdge}
                onReconnectEdgePointerDown={handleEdgeReconnectPointerDown}
                previewConnection={previewConnection}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0"
              >
                <div className="absolute -top-1.5 -left-1.5 size-3 rounded-full border border-sky-400/60 bg-sky-400/20 shadow-[0_0_20px_rgba(56,189,248,0.35)]" />
              </div>

              {nodes.map((node) => (
                <div
                  key={node.id}
                  ref={(element) => handleNodeElementRef(node.id, element)}
                  data-workflow-node
                  className={cn(
                    "absolute select-none",
                    draggingNodeId === node.id
                      ? "z-20 cursor-grabbing"
                      : "cursor-grab",
                    selectedNodeIdSet.has(node.id) && "z-10"
                  )}
                  style={{
                    left: 0,
                    top: 0,
                    transform: `translate(${node.x}px, ${node.y}px)`,
                  }}
                  onPointerDown={(event) => {
                    const isAdditiveSelection =
                      event.shiftKey || event.metaKey || event.ctrlKey

                    if (isAdditiveSelection) {
                      setSelectedEdgeIds([])
                      setSelectedNodeIds(
                        selectedNodeIdSet.has(node.id)
                          ? selectedNodeIds.filter(
                              (selectedNodeId) => selectedNodeId !== node.id
                            )
                          : [...selectedNodeIds, node.id]
                      )
                    } else {
                      setSelectedEdgeIds([])
                      setSelectedNodeIds([node.id])
                    }

                    handleNodePointerDown(event, node)
                  }}
                >
                  {renderWorkflowCanvasNode({
                    node,
                    isSelected: selectedNodeIdSet.has(node.id),
                    executionStatus: nodeExecutionStates[node.id]?.status,
                    executionState: nodeExecutionStates[node.id],
                    onPortPointerDown: handlePortPointerDown,
                    onRunPreview: handleRunPreview,
                    onPatchNode: handlePatchNode,
                    onCommitNodeChanges: flushHistory,
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <WorkflowCanvasSelectionLayer
          isVisible={isSelectionOverlayVisible}
          selectionBox={selectionBox}
          persistedSelectionBox={persistedSelectionOverlayBox}
          isDraggingSelection={isDraggingSelection}
          onSelectionDragPointerDown={handleSelectionDragPointerDown}
        />
      </div>
    </WorkflowCanvasContextMenu>
  )
}
