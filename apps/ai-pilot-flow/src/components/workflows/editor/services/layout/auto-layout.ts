import type { WorkflowCanvasNode } from "@/components/workflows/editor/nodes/registry/workflow-node-registry"

export type AutoLayoutDirection = "horizontal" | "vertical"

export type AutoLayoutOptions = {
  direction?: AutoLayoutDirection
  startX?: number
  startY?: number
  gapX?: number
  gapY?: number
}

const DEFAULT_HORIZONTAL_GAP = 420
const DEFAULT_VERTICAL_GAP = 260

export function autoLayout(
  nodes: WorkflowCanvasNode[],
  options: AutoLayoutOptions = {}
): WorkflowCanvasNode[] {
  const {
    direction = "horizontal",
    startX = 0,
    startY = 0,
    gapX = DEFAULT_HORIZONTAL_GAP,
    gapY = DEFAULT_VERTICAL_GAP,
  } = options

  return nodes.map((node, index) => {
    if (direction === "vertical") {
      return {
        ...node,
        x: startX,
        y: startY + index * gapY,
      }
    }

    return {
      ...node,
      x: startX + index * gapX,
      y: startY,
    }
  })
}
