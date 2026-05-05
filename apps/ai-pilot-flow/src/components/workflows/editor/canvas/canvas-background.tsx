"use client"

import * as React from "react"

type WorkflowCanvasBackgroundProps = {
  viewport: {
    x: number
    y: number
    scale: number
  }
}

const GRID_BASE_SIZE = 24
// Make 100% look like the previous ~80% density.
const GRID_DENSITY_FACTOR = 0.8
const GRID_DOT_BASE_RADIUS_PX = 0.8
const GRID_DOT_MIN_RADIUS_PX = 0.35
const GRID_DOT_MAX_RADIUS_PX = 1.2
const GRID_MIN_SIZE = 8
const GRID_MAX_SIZE = 56

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function positiveModulo(value: number, base: number) {
  return ((value % base) + base) % base
}

export function WorkflowCanvasBackground({
  viewport,
}: WorkflowCanvasBackgroundProps) {
  // 背景网格跟随缩放变化，但会被限制在一个可读的视觉范围内。
  const gridSize = clamp(
    GRID_BASE_SIZE * GRID_DENSITY_FACTOR * viewport.scale,
    GRID_MIN_SIZE,
    GRID_MAX_SIZE
  )
  const gridDotRadius = clamp(
    GRID_DOT_BASE_RADIUS_PX * viewport.scale,
    GRID_DOT_MIN_RADIUS_PX,
    GRID_DOT_MAX_RADIUS_PX
  )
  // 平移时只需要移动背景贴图的位置，不需要重新计算世界坐标。
  const gridPositionX = positiveModulo(viewport.x, gridSize)
  const gridPositionY = positiveModulo(viewport.y, gridSize)

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
        data-workflow-overlay
      >
        <div className="absolute top-1/2 left-[-14px] h-px w-7 -translate-y-1/2 bg-amber-400/60" />
        <div className="absolute top-[-14px] left-1/2 h-7 w-px -translate-x-1/2 bg-amber-400/60" />
        <div className="absolute -top-1 -left-1 size-2 rounded-full border border-amber-400/70 bg-amber-400/20" />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(128, 141, 176, 0.28) ${gridDotRadius}px, transparent ${gridDotRadius}px)`,
          backgroundPosition: `calc(50% + ${gridPositionX}px) calc(50% + ${gridPositionY}px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />
    </>
  )
}
