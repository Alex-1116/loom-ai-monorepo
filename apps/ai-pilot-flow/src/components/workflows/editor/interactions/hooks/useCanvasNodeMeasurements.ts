"use client"

import * as React from "react"

import type { WorkflowPortRef } from "@/components/workflows/editor/model/types/workflow-edge"

type CanvasNodeIdentity = {
  id: string
}

type CanvasNodeSize = {
  width: number
  height: number
}

export type CanvasPortAnchor = {
  x: number
  y: number
}

export type CanvasNodePortAnchors = Record<string, CanvasPortAnchor>

type UseCanvasNodeMeasurementsParams<Node extends CanvasNodeIdentity> = {
  nodes: Node[]
}

function getPortAnchorKey(port: Pick<WorkflowPortRef, "side" | "key">) {
  return `${port.side}:${port.key ?? "__default__"}`
}

function getOffsetRelativeToAncestor(
  element: HTMLElement,
  ancestor: HTMLElement
): { left: number; top: number } | null {
  let current: HTMLElement | null = element
  let left = 0
  let top = 0

  while (current && current !== ancestor) {
    left += current.offsetLeft
    top += current.offsetTop
    current = current.offsetParent as HTMLElement | null
  }

  if (current !== ancestor) {
    return null
  }

  return { left, top }
}

function getElementCenterRelativeToNode(
  element: HTMLElement,
  nodeElement: HTMLDivElement
): CanvasPortAnchor | null {
  const nodeRect = nodeElement.getBoundingClientRect()
  const elementRect = element.getBoundingClientRect()
  const scaleX =
    nodeElement.offsetWidth > 0 ? nodeRect.width / nodeElement.offsetWidth : 1
  const scaleY =
    nodeElement.offsetHeight > 0
      ? nodeRect.height / nodeElement.offsetHeight
      : 1
  const safeScaleX = scaleX || 1
  const safeScaleY = scaleY || 1

  return {
    x: (elementRect.left + elementRect.width / 2 - nodeRect.left) / safeScaleX,
    y: (elementRect.top + elementRect.height / 2 - nodeRect.top) / safeScaleY,
  }
}

export function useCanvasNodeMeasurements<Node extends CanvasNodeIdentity>({
  nodes,
}: UseCanvasNodeMeasurementsParams<Node>) {
  const nodeElementsRef = React.useRef<Map<string, HTMLDivElement>>(new Map())
  const [nodeSizes, setNodeSizes] = React.useState<
    Record<string, CanvasNodeSize>
  >({})
  const [portAnchors, setPortAnchors] = React.useState<
    Record<string, CanvasNodePortAnchors>
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

    setPortAnchors((current) => {
      let changed = false
      const next: Record<string, CanvasNodePortAnchors> = {}

      for (const node of nodes) {
        const element = nodeElementsRef.current.get(node.id)
        if (!element) {
          continue
        }

        const portElements = element.querySelectorAll<HTMLElement>(
          "[data-workflow-port='true']"
        )
        const nodePortAnchors: CanvasNodePortAnchors = {}

        portElements.forEach((portElement) => {
          const side = portElement.dataset.workflowPortSide
          if (side !== "left" && side !== "right") {
            return
          }

          const anchorKey = getPortAnchorKey({
            side,
            key: portElement.dataset.workflowPortKey || undefined,
          })

          const portDot =
            portElement.querySelector<HTMLElement>(
              "[data-workflow-port-dot='true']"
            ) ?? portElement
          const preciseAnchor = getElementCenterRelativeToNode(portDot, element)

          if (preciseAnchor) {
            nodePortAnchors[anchorKey] = preciseAnchor
            return
          }

          const relativeOffset = getOffsetRelativeToAncestor(
            portElement,
            element
          )
          if (!relativeOffset) {
            return
          }

          nodePortAnchors[anchorKey] = {
            x: relativeOffset.left + portElement.offsetWidth / 2,
            y: relativeOffset.top + portElement.offsetHeight / 2,
          }
        })

        next[node.id] = nodePortAnchors

        const previous = current[node.id] ?? {}
        const previousKeys = Object.keys(previous)
        const nextKeys = Object.keys(nodePortAnchors)
        if (previousKeys.length !== nextKeys.length) {
          changed = true
          continue
        }

        for (const key of nextKeys) {
          const previousAnchor = previous[key]
          const nextAnchor = nodePortAnchors[key]
          if (
            !nextAnchor ||
            !previousAnchor ||
            previousAnchor.x !== nextAnchor.x ||
            previousAnchor.y !== nextAnchor.y
          ) {
            changed = true
            break
          }
        }
      }

      for (const nodeId of Object.keys(current)) {
        if (!(nodeId in next)) {
          changed = true
          break
        }
      }

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
    portAnchors,
    handleNodeElementRef,
  }
}
