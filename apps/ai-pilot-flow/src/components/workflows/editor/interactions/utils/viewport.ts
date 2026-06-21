"use client"

import type { ViewportState } from "@/components/workflows/editor/model/types/viewport"
import type { Point } from "./pointer"

export const MIN_SCALE = 0.01
export const MAX_SCALE = 2
const ZOOM_STEP = 0.1

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function normalizeScale(scale: number) {
  return Math.round(scale * 100) / 100
}

export function getNextZoomStep(scale: number, direction: "in" | "out") {
  const delta = direction === "in" ? ZOOM_STEP : -ZOOM_STEP
  return clamp(normalizeScale(scale + delta), MIN_SCALE, MAX_SCALE)
}

export function getSurfaceCenter(size: { width: number; height: number }) {
  return {
    x: size.width / 2,
    y: size.height / 2,
  }
}

export function scaleViewport(
  viewport: ViewportState,
  nextScale: number,
  point: Point,
  center: Point
): ViewportState {
  const scale = clamp(normalizeScale(nextScale), MIN_SCALE, MAX_SCALE)
  // 先求出 point 当前对应的世界坐标，再在新缩放下把它放回原来的屏幕位置。
  const canvasX = (point.x - center.x - viewport.x) / viewport.scale
  const canvasY = (point.y - center.y - viewport.y) / viewport.scale

  return {
    scale,
    x: point.x - center.x - canvasX * scale,
    y: point.y - center.y - canvasY * scale,
  }
}
