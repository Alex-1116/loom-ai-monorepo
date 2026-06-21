"use client"

import * as React from "react"

import { cn } from "@loom/ui/lib/utils"

type SelectionBox = {
  left: number
  top: number
  width: number
  height: number
} | null

type WorkflowCanvasSelectionLayerProps = {
  isVisible: boolean
  selectionBox: SelectionBox
  persistedSelectionBox: SelectionBox
  isDraggingSelection?: boolean
  onSelectionDragPointerDown?: React.PointerEventHandler<HTMLDivElement>
}

export function WorkflowCanvasSelectionLayer({
  isVisible,
  selectionBox,
  persistedSelectionBox,
  isDraggingSelection = false,
  onSelectionDragPointerDown,
}: WorkflowCanvasSelectionLayerProps) {
  const activeSelectionBox = selectionBox ?? persistedSelectionBox

  if (!isVisible) {
    return null
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[60] bg-slate-950/14"
    >
      {activeSelectionBox ? (
        <>
          {selectionBox ? (
            <div
              className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/80 bg-sky-300/30 shadow-[0_0_20px_rgba(56,189,248,0.45)]"
              style={{
                left: selectionBox.left,
                top: selectionBox.top,
              }}
            />
          ) : null}

          {selectionBox ? (
            <div
              className="absolute rounded-2xl shadow-[0_18px_40px_rgba(15,23,42,0.16)]"
              style={{
                left: selectionBox.left,
                top: selectionBox.top,
                width: selectionBox.width,
                height: selectionBox.height,
                backgroundColor: "rgba(71, 85, 105, 0.12)",
              }}
            />
          ) : persistedSelectionBox ? (
            <div
              className={cn(
                "pointer-events-auto absolute rounded-2xl shadow-[0_18px_40px_rgba(15,23,42,0.16)]",
                isDraggingSelection ? "cursor-grabbing" : "cursor-grab"
              )}
              style={{
                left: persistedSelectionBox.left,
                top: persistedSelectionBox.top,
                width: persistedSelectionBox.width,
                height: persistedSelectionBox.height,
                backgroundColor: "rgba(71, 85, 105, 0.12)",
              }}
              onPointerDown={onSelectionDragPointerDown}
            />
          ) : null}
        </>
      ) : null}
    </div>
  )
}
