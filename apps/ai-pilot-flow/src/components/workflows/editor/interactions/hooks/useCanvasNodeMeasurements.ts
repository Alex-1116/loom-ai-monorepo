"use client"

import * as React from "react"

type CanvasNodeIdentity = {
  id: string
}

type CanvasNodeSize = {
  width: number
  height: number
}

type UseCanvasNodeMeasurementsParams<Node extends CanvasNodeIdentity> = {
  nodes: Node[]
}

export function useCanvasNodeMeasurements<Node extends CanvasNodeIdentity>({
  nodes,
}: UseCanvasNodeMeasurementsParams<Node>) {
  const nodeElementsRef = React.useRef<Map<string, HTMLDivElement>>(new Map())
  const [nodeSizes, setNodeSizes] = React.useState<
    Record<string, CanvasNodeSize>
  >({})

  const measureNodeSizes = React.useCallback(() => {
    setNodeSizes((current) => {
      let changed = false
      const next: Record<string, CanvasNodeSize> = {}

      for (const node of nodes) {
        const element = nodeElementsRef.current.get(node.id)
        if (!element) {
          continue
        }

        const width = element.offsetWidth
        const height = element.offsetHeight
        next[node.id] = { width, height }

        const previous = current[node.id]
        if (
          !previous ||
          previous.width !== width ||
          previous.height !== height
        ) {
          changed = true
        }
      }

      for (const nodeId of Object.keys(current)) {
        if (!(nodeId in next)) {
          changed = true
          break
        }
      }

      // 尺寸没有变化时复用旧引用，避免把后续吸附链路全部无意义触发一遍。
      return changed ? next : current
    })
  }, [nodes])

  React.useLayoutEffect(() => {
    measureNodeSizes()
  }, [measureNodeSizes])

  React.useEffect(() => {
    if (typeof ResizeObserver === "undefined") {
      return
    }

    // 节点内容变化可能带来尺寸变化，交给 ResizeObserver 持续同步即可。
    const observer = new ResizeObserver(() => {
      measureNodeSizes()
    })

    for (const element of nodeElementsRef.current.values()) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [measureNodeSizes, nodes])

  const handleNodeElementRef = React.useCallback(
    (nodeId: string, element: HTMLDivElement | null) => {
      if (element) {
        nodeElementsRef.current.set(nodeId, element)
      } else {
        nodeElementsRef.current.delete(nodeId)
      }
    },
    []
  )

  return {
    nodeSizes,
    handleNodeElementRef,
  }
}
