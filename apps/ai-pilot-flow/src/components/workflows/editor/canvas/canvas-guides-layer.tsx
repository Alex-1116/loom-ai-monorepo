"use client"

import * as React from "react"
import { type SnapGuides } from "@/components/workflows/editor/interactions/utils/snapping"

type WorkflowCanvasGuidesLayerProps = {
  guides: SnapGuides
  viewport: {
    x: number
    y: number
    scale: number
  }
}

export function WorkflowCanvasGuidesLayer({
  guides,
  viewport,
}: WorkflowCanvasGuidesLayerProps) {
  const layerRef = React.useRef<HTMLDivElement | null>(null)
  const [surfaceSize, setSurfaceSize] = React.useState({ width: 0, height: 0 })

  React.useLayoutEffect(() => {
    const element = layerRef.current
    if (!element) {
      return
    }

    const updateSize = () => {
      setSurfaceSize({
        width: element.offsetWidth,
        height: element.offsetHeight,
      })
    }

    updateSize()

    if (typeof ResizeObserver === "undefined") {
      return
    }

    const observer = new ResizeObserver(() => {
      updateSize()
    })
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  if (!guides.verticalGuide && !guides.horizontalGuide) {
    return (
      <div
        ref={layerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-40"
      />
    )
  }

  const guideThickness = 1
  // guides 来自世界坐标，这里统一换算成屏幕坐标再做 overlay 渲染。
  const centerX = surfaceSize.width / 2 + viewport.x
  const centerY = surfaceSize.height / 2 + viewport.y
  const verticalGuide = guides.verticalGuide
    ? {
        position: centerX + guides.verticalGuide.position * viewport.scale,
        start: centerY + guides.verticalGuide.start * viewport.scale,
        end: centerY + guides.verticalGuide.end * viewport.scale,
      }
    : null
  const horizontalGuide = guides.horizontalGuide
    ? {
        position: centerY + guides.horizontalGuide.position * viewport.scale,
        start: centerX + guides.horizontalGuide.start * viewport.scale,
        end: centerX + guides.horizontalGuide.end * viewport.scale,
      }
    : null

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-40"
    >
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        {verticalGuide ? (
          <line
            x1={verticalGuide.position}
            y1={0}
            x2={verticalGuide.position}
            y2={surfaceSize.height}
            stroke="rgba(125, 211, 252, 0.98)"
            strokeWidth={guideThickness}
            strokeLinecap="round"
          />
        ) : null}

        {horizontalGuide ? (
          <line
            x1={0}
            y1={horizontalGuide.position}
            x2={surfaceSize.width}
            y2={horizontalGuide.position}
            stroke="rgba(125, 211, 252, 0.98)"
            strokeWidth={guideThickness}
            strokeLinecap="round"
          />
        ) : null}
      </svg>

      {verticalGuide && horizontalGuide ? (
        <div
          className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-200 bg-sky-300 shadow-[0_0_26px_rgba(125,211,252,0.85)]"
          style={{
            left: verticalGuide.position,
            top: horizontalGuide.position,
          }}
        />
      ) : null}
    </div>
  )
}
