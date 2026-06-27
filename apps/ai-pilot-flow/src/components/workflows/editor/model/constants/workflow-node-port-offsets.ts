export const STACKED_NODE_PORT_OFFSET_START = 72
export const STACKED_NODE_PORT_OFFSET_STEP = 72

export function getNodePortOffset(
  index: number,
  {
    start = STACKED_NODE_PORT_OFFSET_START,
    step = STACKED_NODE_PORT_OFFSET_STEP,
  }: {
    start?: number
    step?: number
  } = {}
) {
  return start + index * step
}
