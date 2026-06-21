"use client"

import * as React from "react"

import {
  distance,
  getElementRelativePoint,
  getElementSize,
  type Point,
} from "@/components/workflows/editor/interactions/utils/pointer"
import {
  clamp,
  getNextZoomStep,
  MAX_SCALE,
  MIN_SCALE,
  getSurfaceCenter,
  normalizeScale,
  scaleViewport,
  type ViewportState,
} from "@/components/workflows/editor/interactions/utils/viewport"

type TouchGestureState = {
  ids: [number, number]
  // Surface-local coordinates at gesture start.
  startA: Point
  startB: Point
  // World coordinate under the start centroid (in canvas units, before transform).
  worldAtStartCentroid: Point
  originViewport: ViewportState
  // Cached for ratio; guard against divide-by-zero.
  startDistance: number
} | null

type UseCanvasZoomParams = {
  surfaceRef: React.RefObject<HTMLDivElement | null>
  viewport: ViewportState
  setViewport: (updater: React.SetStateAction<ViewportState>) => void
  commitViewport: (updater: React.SetStateAction<ViewportState>) => void
}

export function useCanvasZoom({
  surfaceRef,
  viewport,
  setViewport,
  commitViewport,
}: UseCanvasZoomParams) {
  const viewportRef = React.useRef<ViewportState>(viewport)
  const touchPointersRef = React.useRef<Map<number, Point>>(new Map())
  const touchGestureRef = React.useRef<TouchGestureState>(null)

  React.useEffect(() => {
    viewportRef.current = viewport
  }, [viewport])

  const getSurfaceSize = React.useCallback(() => {
    return getElementSize(surfaceRef.current)
  }, [surfaceRef])

  const getSurfacePointFromEvent = React.useCallback(
    (event: { clientX: number; clientY: number }) => {
      return getElementRelativePoint(surfaceRef.current, event)
    },
    [surfaceRef]
  )

  const zoomToPoint = React.useCallback(
    (nextScale: number, point?: { x: number; y: number }) => {
      const size = getSurfaceSize()
      if (!size) {
        return
      }

      const center = getSurfaceCenter(size)
      const fallbackPoint = center

      setViewport((current) =>
        // 缩放时保持 point 下方的世界坐标不跳动，手感会稳定很多。
        scaleViewport(current, nextScale, point ?? fallbackPoint, center)
      )
    },
    [getSurfaceSize, setViewport]
  )

  const handleZoomIn = React.useCallback(() => {
    commitViewport((current) => {
      const size = getSurfaceSize()
      if (!size) {
        return current
      }

      const center = getSurfaceCenter(size)
      return scaleViewport(
        current,
        getNextZoomStep(current.scale, "in"),
        center,
        center
      )
    })
  }, [commitViewport, getSurfaceSize])

  const handleZoomOut = React.useCallback(() => {
    commitViewport((current) => {
      const size = getSurfaceSize()
      if (!size) {
        return current
      }

      const center = getSurfaceCenter(size)
      return scaleViewport(
        current,
        getNextZoomStep(current.scale, "out"),
        center,
        center
      )
    })
  }, [commitViewport, getSurfaceSize])

  const handleZoomReset = React.useCallback(() => {
    commitViewport((current) => ({
      ...current,
      scale: normalizeScale(1),
    }))
  }, [commitViewport])

  const handleZoomFit = React.useCallback(() => {
    commitViewport({
      x: 0,
      y: 0,
      scale: normalizeScale(1),
    })
  }, [commitViewport])

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const metaKey = event.metaKey || event.ctrlKey
      if (!metaKey) {
        return
      }

      if (event.key === "=" || event.key === "+") {
        event.preventDefault()
        handleZoomIn()
      }

      if (event.key === "-") {
        event.preventDefault()
        handleZoomOut()
      }

      if (event.key === "0") {
        event.preventDefault()
        handleZoomReset()
      }

      if (event.key === "1") {
        event.preventDefault()
        handleZoomFit()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleZoomFit, handleZoomIn, handleZoomOut, handleZoomReset])

  const handleTouchPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== "touch") {
        return false
      }

      const point = getSurfacePointFromEvent(event)
      if (!point) {
        return true
      }

      touchPointersRef.current.set(event.pointerId, point)
      event.currentTarget.setPointerCapture(event.pointerId)

      if (touchPointersRef.current.size === 2) {
        const size = getSurfaceSize()
        if (!size) {
          return true
        }

        const center = getSurfaceCenter(size)
        const pointerIds = Array.from(touchPointersRef.current.keys())
        const idA = pointerIds[0]
        const idB = pointerIds[1]
        if (idA === undefined || idB === undefined) {
          return true
        }

        const startA = touchPointersRef.current.get(idA)
        const startB = touchPointersRef.current.get(idB)
        if (!startA || !startB) {
          return true
        }

        const startCentroid = {
          x: (startA.x + startB.x) / 2,
          y: (startA.y + startB.y) / 2,
        }
        // 双指缩放时先记住“手势中心对应的世界坐标”，后面才能围绕该点缩放。
        const worldAtStartCentroid = {
          x: (startCentroid.x - center.x - viewport.x) / viewport.scale,
          y: (startCentroid.y - center.y - viewport.y) / viewport.scale,
        }

        touchGestureRef.current = {
          ids: [idA, idB],
          startA,
          startB,
          worldAtStartCentroid,
          originViewport: viewport,
          startDistance: Math.max(distance(startA, startB), 0.001),
        }
      }

      return true
    },
    [getSurfacePointFromEvent, getSurfaceSize, viewport]
  )

  const handleTouchPointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== "touch") {
        return false
      }

      const point = getSurfacePointFromEvent(event)
      if (!point) {
        return true
      }

      const size = getSurfaceSize()
      if (!size) {
        return true
      }

      if (!touchPointersRef.current.has(event.pointerId)) {
        return true
      }

      touchPointersRef.current.set(event.pointerId, point)
      const gesture = touchGestureRef.current
      if (!gesture) {
        return true
      }

      const [idA, idB] = gesture.ids
      const currentA = touchPointersRef.current.get(idA)
      const currentB = touchPointersRef.current.get(idB)
      if (!currentA || !currentB) {
        return true
      }

      const centroid = {
        x: (currentA.x + currentB.x) / 2,
        y: (currentA.y + currentB.y) / 2,
      }
      const center = getSurfaceCenter(size)
      const nextScale = clamp(
        normalizeScale(
          gesture.originViewport.scale *
            (distance(currentA, currentB) / gesture.startDistance)
        ),
        MIN_SCALE,
        MAX_SCALE
      )

      setViewport({
        scale: nextScale,
        x: centroid.x - center.x - gesture.worldAtStartCentroid.x * nextScale,
        y: centroid.y - center.y - gesture.worldAtStartCentroid.y * nextScale,
      })
      event.preventDefault()

      return true
    },
    [getSurfacePointFromEvent, getSurfaceSize, setViewport]
  )

  const handleTouchPointerEnd = React.useCallback(
    (event?: React.PointerEvent<HTMLDivElement>) => {
      if (event?.pointerType !== "touch") {
        return false
      }

      touchPointersRef.current.delete(event.pointerId)
      const gesture = touchGestureRef.current
      if (gesture?.ids.includes(event.pointerId)) {
        touchGestureRef.current = null
      }

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      return true
    },
    []
  )

  const handleWheelNative = React.useCallback(
    (event: WheelEvent) => {
      if (
        (event.target as HTMLElement | null)?.closest?.(
          "[data-workflow-overlay]"
        )
      ) {
        return
      }

      // Critical: must be non-passive to stop browser navigation / rubber-banding on macOS.
      event.preventDefault()

      if (!event.ctrlKey && !event.metaKey) {
        // 普通滚轮优先解释为平移；按住 meta/ctrl 时再切换为缩放。
        setViewport((current) => ({
          ...current,
          x: current.x - event.deltaX,
          y: current.y - event.deltaY,
        }))
        return
      }

      const point = getSurfacePointFromEvent(event)
      if (!point) {
        return
      }

      const direction = event.deltaY < 0 ? "in" : "out"
      const nextScale = getNextZoomStep(viewportRef.current.scale, direction)

      zoomToPoint(nextScale, point)
    },
    [getSurfacePointFromEvent, setViewport, zoomToPoint]
  )

  React.useEffect(() => {
    const surface = surfaceRef.current
    if (!surface) {
      return
    }

    surface.addEventListener("wheel", handleWheelNative, { passive: false })
    return () => surface.removeEventListener("wheel", handleWheelNative)
  }, [handleWheelNative, surfaceRef])

  return {
    handleTouchPointerDown,
    handleTouchPointerMove,
    handleTouchPointerEnd,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleZoomFit,
  }
}
