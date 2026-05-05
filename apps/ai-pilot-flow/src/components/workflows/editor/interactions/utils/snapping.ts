"use client"

export type SnapNodeBounds = {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export type SnapGuide = {
  position: number
  start: number
  end: number
}

export type SnapGuides = {
  verticalGuide: SnapGuide | null
  horizontalGuide: SnapGuide | null
}

type SnapResult = {
  position: {
    x: number
    y: number
  }
  guides: SnapGuides
}

function getVerticalAnchors(node: SnapNodeBounds) {
  // 左边 / 中线 / 右边三条纵向对齐锚点。
  return [
    { value: node.x, top: node.y, bottom: node.y + node.height },
    {
      value: node.x + node.width / 2,
      top: node.y,
      bottom: node.y + node.height,
    },
    { value: node.x + node.width, top: node.y, bottom: node.y + node.height },
  ]
}

function getHorizontalAnchors(node: SnapNodeBounds) {
  // 上边 / 中线 / 下边三条横向对齐锚点。
  return [
    { value: node.y, left: node.x, right: node.x + node.width },
    {
      value: node.y + node.height / 2,
      left: node.x,
      right: node.x + node.width,
    },
    { value: node.y + node.height, left: node.x, right: node.x + node.width },
  ]
}

export function getSnappedNodePosition(params: {
  activeNodeId: string
  position: { x: number; y: number }
  nodeSize: { width: number; height: number } | null
  nodes: SnapNodeBounds[]
  threshold: number
  verticalTargets?: number[]
  horizontalTargets?: number[]
}): SnapResult {
  const {
    activeNodeId,
    position,
    nodeSize,
    nodes,
    threshold,
    verticalTargets = [],
    horizontalTargets = [],
  } = params

  if (!nodeSize || nodeSize.width <= 0 || nodeSize.height <= 0) {
    return {
      position,
      guides: {
        verticalGuide: null,
        horizontalGuide: null,
      },
    }
  }

  const activeNode: SnapNodeBounds = {
    id: activeNodeId,
    x: position.x,
    y: position.y,
    width: nodeSize.width,
    height: nodeSize.height,
  }

  const otherNodes = nodes.filter(
    (node) =>
      node.id !== activeNodeId &&
      Number.isFinite(node.width) &&
      Number.isFinite(node.height) &&
      node.width > 0 &&
      node.height > 0
  )

  if (
    otherNodes.length === 0 &&
    verticalTargets.length === 0 &&
    horizontalTargets.length === 0
  ) {
    return {
      position,
      guides: {
        verticalGuide: null,
        horizontalGuide: null,
      },
    }
  }

  let snappedX = position.x
  let snappedY = position.y
  let bestVerticalDiff = threshold + 1
  let bestHorizontalDiff = threshold + 1
  let verticalGuide: SnapGuide | null = null
  let horizontalGuide: SnapGuide | null = null

  const activeVerticalAnchors = getVerticalAnchors(activeNode)
  const activeHorizontalAnchors = getHorizontalAnchors(activeNode)

  for (const otherNode of otherNodes) {
    const otherVerticalAnchors = getVerticalAnchors(otherNode)
    const otherHorizontalAnchors = getHorizontalAnchors(otherNode)

    for (const activeAnchor of activeVerticalAnchors) {
      for (const otherAnchor of otherVerticalAnchors) {
        const diff = Math.abs(activeAnchor.value - otherAnchor.value)
        if (diff > threshold || diff >= bestVerticalDiff) {
          continue
        }

        bestVerticalDiff = diff
        snappedX = position.x + (otherAnchor.value - activeAnchor.value)
        verticalGuide = {
          position: otherAnchor.value,
          start: Math.min(activeAnchor.top, otherAnchor.top),
          end: Math.max(activeAnchor.bottom, otherAnchor.bottom),
        }
      }
    }

    for (const activeAnchor of activeHorizontalAnchors) {
      for (const otherAnchor of otherHorizontalAnchors) {
        const diff = Math.abs(activeAnchor.value - otherAnchor.value)
        if (diff > threshold || diff >= bestHorizontalDiff) {
          continue
        }

        bestHorizontalDiff = diff
        snappedY = position.y + (otherAnchor.value - activeAnchor.value)
        horizontalGuide = {
          position: otherAnchor.value,
          start: Math.min(activeAnchor.left, otherAnchor.left),
          end: Math.max(activeAnchor.right, otherAnchor.right),
        }
      }
    }
  }

  for (const activeAnchor of activeVerticalAnchors) {
    for (const target of verticalTargets) {
      const diff = Math.abs(activeAnchor.value - target)
      if (diff > threshold || diff >= bestVerticalDiff) {
        continue
      }

      bestVerticalDiff = diff
      snappedX = position.x + (target - activeAnchor.value)
      verticalGuide = {
        position: target,
        start: activeAnchor.top,
        end: activeAnchor.bottom,
      }
    }
  }

  for (const activeAnchor of activeHorizontalAnchors) {
    for (const target of horizontalTargets) {
      const diff = Math.abs(activeAnchor.value - target)
      if (diff > threshold || diff >= bestHorizontalDiff) {
        continue
      }

      bestHorizontalDiff = diff
      snappedY = position.y + (target - activeAnchor.value)
      horizontalGuide = {
        position: target,
        start: activeAnchor.left,
        end: activeAnchor.right,
      }
    }
  }

  if (snappedX !== position.x && verticalGuide) {
    const currentVerticalGuide = verticalGuide
    const snappedNode = { ...activeNode, x: snappedX }
    const snappedAnchor = getVerticalAnchors(snappedNode).find(
      (anchor) => Math.abs(anchor.value - currentVerticalGuide.position) < 0.001
    )

    if (snappedAnchor) {
      verticalGuide = {
        position: currentVerticalGuide.position,
        start: Math.min(snappedAnchor.top, currentVerticalGuide.start),
        end: Math.max(snappedAnchor.bottom, currentVerticalGuide.end),
      }
    }
  }

  if (snappedY !== position.y && horizontalGuide) {
    const currentHorizontalGuide = horizontalGuide
    const snappedNode = { ...activeNode, y: snappedY }
    const snappedAnchor = getHorizontalAnchors(snappedNode).find(
      (anchor) =>
        Math.abs(anchor.value - currentHorizontalGuide.position) < 0.001
    )

    if (snappedAnchor) {
      horizontalGuide = {
        position: currentHorizontalGuide.position,
        start: Math.min(snappedAnchor.left, currentHorizontalGuide.start),
        end: Math.max(snappedAnchor.right, currentHorizontalGuide.end),
      }
    }
  }

  return {
    position: {
      x: snappedX,
      y: snappedY,
    },
    guides: {
      verticalGuide,
      horizontalGuide,
    },
  }
}
