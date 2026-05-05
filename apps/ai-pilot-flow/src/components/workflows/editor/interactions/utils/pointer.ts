"use client"

export type Point = {
  x: number
  y: number
}

export function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function getElementSize(element: HTMLElement | null) {
  const rect = element?.getBoundingClientRect()
  if (!rect) {
    return null
  }

  return {
    width: rect.width,
    height: rect.height,
  }
}

export function getElementRelativePoint(
  element: HTMLElement | null,
  event: { clientX: number; clientY: number }
) {
  const rect = element?.getBoundingClientRect()
  if (!rect) {
    return null
  }

  // 统一把屏幕坐标换成某个容器内部的局部坐标。
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}
