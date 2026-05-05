"use client"

import * as React from "react"

import { cn } from "@loom/ui/lib/utils"

import {
  WorkflowCanvasBottomToolbar,
  type WorkflowCanvasTool,
} from "@/components/workflows/editor/chrome/toolbar/canvas-bottom-toolbar"
import { WorkflowCanvasBackground } from "@/components/workflows/editor/canvas/canvas-background"
import { WorkflowCanvasContextMenu } from "@/components/workflows/editor/canvas/canvas-context-menu"
import { WorkflowCanvasGuidesLayer } from "@/components/workflows/editor/canvas/canvas-guides-layer"
import { WorkflowCanvasLeftToolbar } from "@/components/workflows/editor/chrome/toolbar/canvas-left-toolbar"
import {
  createInitialWorkflowNodes,
  createWorkflowNode,
} from "@/components/workflows/editor/nodes/registry/workflow-node-factory"
import { type WorkflowCanvasNode } from "@/components/workflows/editor/nodes/registry/workflow-node-registry"
import { WorkflowPromptNode } from "@/components/workflows/editor/nodes/blocks/prompt/workflow-prompt-node"
import { WorkflowFileNode } from "@/components/workflows/editor/nodes/blocks/file/workflow-file-node"
import { WorkflowExportNode } from "@/components/workflows/editor/nodes/blocks/export/workflow-export-node"
import { useCanvasPan } from "@/components/workflows/editor/interactions/hooks/useCanvasPan"
import { useCanvasNodeDrag } from "@/components/workflows/editor/interactions/hooks/useCanvasNodeDrag"
import { useCanvasNodeMeasurements } from "@/components/workflows/editor/interactions/hooks/useCanvasNodeMeasurements"
import { useCanvasSnapping } from "@/components/workflows/editor/interactions/hooks/useCanvasSnapping"
import { useCanvasViewportControls } from "@/components/workflows/editor/interactions/hooks/useCanvasViewportControls"
import {
  getElementRelativePoint,
  getElementSize,
} from "@/components/workflows/editor/interactions/utils/pointer"
import { useCanvasZoom } from "@/components/workflows/editor/interactions/hooks/useCanvasZoom"

type ViewportState = {
  x: number
  y: number
  scale: number
}

type WorkflowCanvasNodeSize = {
  width: number
  height: number
}

const initialNodes = createInitialWorkflowNodes()

function formatZoom(scale: number) {
  return `${Math.round(scale * 100)}%`
}

export function WorkflowCanvasViewport() {
  const surfaceRef = React.useRef<HTMLDivElement | null>(null)
  const nodesRef = React.useRef<WorkflowCanvasNode[]>(initialNodes)
  const nodeSizesRef = React.useRef<Record<string, WorkflowCanvasNodeSize>>({})
  const [activeTool, setActiveTool] =
    React.useState<WorkflowCanvasTool>("select")
  const [viewport, setViewport] = React.useState<ViewportState>({
    x: 0,
    y: 0,
    scale: 1,
  })
  const [nodes, setNodes] = React.useState<WorkflowCanvasNode[]>(
    () => initialNodes
  )
  const { nodeSizes, handleNodeElementRef } = useCanvasNodeMeasurements({
    nodes,
  })

  React.useEffect(() => {
    // 拖拽和吸附逻辑依赖最新节点数据，但不希望因为闭包导致频繁重绑事件。
    nodesRef.current = nodes
  }, [nodes])

  React.useEffect(() => {
    // 节点尺寸由独立 hook 维护，这里只同步给吸附层读取。
    nodeSizesRef.current = nodeSizes
  }, [nodeSizes])

  const {
    guides: activeSnapGuides,
    clearGuides,
    handleNodePositionChange,
  } = useCanvasSnapping({
    viewport,
    nodesRef,
    nodeSizesRef,
    setNodes,
  })

  const { draggingNodeId, handleNodePointerDown } = useCanvasNodeDrag({
    scale: viewport.scale,
    onNodePositionChange: handleNodePositionChange,
    onDragEnd: clearGuides,
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
    setViewport,
  })

  const { isPanning, handlePointerDown, handlePointerMove, handlePointerEnd } =
    useCanvasPan({
      activeTool,
      viewport,
      setViewport,
      handleTouchPointerDown,
      handleTouchPointerMove,
      handleTouchPointerEnd,
    })

  const { handleResetView } = useCanvasViewportControls({
    setViewport,
    clearGuides,
  })

  const handleCreateNodeFromMenu = React.useCallback(
    (payload: {
      type: WorkflowCanvasNode["type"]
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

      setNodes((current) => [
        ...current,
        createWorkflowNode({
          type: payload.type,
          x,
          y,
        }),
      ])
      clearGuides()
    },
    [clearGuides, viewport.scale, viewport.x, viewport.y]
  )

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
          draggingNodeId && "cursor-grabbing"
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
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
          className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2"
          data-workflow-overlay
        >
          <WorkflowCanvasBottomToolbar
            activeTool={activeTool}
            zoomLabel={formatZoom(viewport.scale)}
            onToolChange={setActiveTool}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onZoomReset={handleZoomReset}
            onZoomFit={handleZoomFit}
            onResetView={handleResetView}
          />
        </div>

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
                      : "cursor-grab"
                  )}
                  style={{
                    left: 0,
                    top: 0,
                    transform: `translate(${node.x}px, ${node.y}px)`,
                  }}
                  onPointerDown={(event) => handleNodePointerDown(event, node)}
                >
                  {node.type === "prompt" ? (
                    <WorkflowPromptNode
                      title={node.data?.title}
                      content={node.data?.content}
                    />
                  ) : node.type === "export" ? (
                    <WorkflowExportNode
                      title={node.data?.title}
                      inputLabel={node.data?.inputLabel}
                      actionLabel={node.data?.actionLabel}
                    />
                  ) : (
                    <WorkflowFileNode title={node.data?.title} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </WorkflowCanvasContextMenu>
  )
}
