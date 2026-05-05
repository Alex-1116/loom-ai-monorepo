"use client"

import * as React from "react"

export function useCanvasBlockGestures<T extends HTMLElement>() {
  const elementRef = React.useRef<T | null>(null)

  React.useEffect(() => {
    const element = elementRef.current
    if (!element) {
      return
    }

    // toolbar / menu 等 overlay 需要吃掉手势，避免事件穿透到底层无限画布。
    const stopWheel = (event: WheelEvent) => {
      event.preventDefault()
      event.stopPropagation()
    }

    const stopGesture = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
    }

    element.addEventListener("wheel", stopWheel, { passive: false })
    element.addEventListener("gesturestart", stopGesture)
    element.addEventListener("gesturechange", stopGesture)
    element.addEventListener("gestureend", stopGesture)

    return () => {
      element.removeEventListener("wheel", stopWheel)
      element.removeEventListener("gesturestart", stopGesture)
      element.removeEventListener("gesturechange", stopGesture)
      element.removeEventListener("gestureend", stopGesture)
    }
  }, [])

  return elementRef
}
