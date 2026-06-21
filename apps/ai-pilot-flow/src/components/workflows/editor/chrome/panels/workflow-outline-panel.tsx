"use client"

import * as React from "react"

import { ListTree } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"

import { useCanvasBlockGestures } from "@/components/workflows/editor/interactions/hooks/useCanvasBlockGestures"
import type { WorkflowCanvasNode } from "@/components/workflows/editor/nodes/registry/workflow-node-registry"

type WorkflowOutlinePanelProps = {
  nodes: WorkflowCanvasNode[]
  selectedNodeIds: string[]
  onSelectNode: (nodeId: string) => void
}

function getNodeDisplayTitle(node: WorkflowCanvasNode, index: number) {
  const title = node.data?.title?.trim()
  if (title) {
    return title
  }

  return `${node.type} ${index + 1}`
}

export function WorkflowOutlinePanel({
  nodes,
  selectedNodeIds,
  onSelectNode,
}: WorkflowOutlinePanelProps) {
  const panelRef = useCanvasBlockGestures<HTMLDivElement>()
  const selectedNodeIdSet = React.useMemo(
    () => new Set(selectedNodeIds),
    [selectedNodeIds]
  )

  return (
    <aside
      ref={panelRef}
      className="pointer-events-auto flex h-full w-[280px] flex-col rounded-2xl border border-white/10 bg-[#171821]/96 p-4 text-white shadow-[0_24px_64px_rgba(0,0,0,0.48)] backdrop-blur-xl"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/75">
          <ListTree className="size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Workflow Outline</p>
          <p className="text-xs text-white/45">
            {nodes.length === 0 ? "No nodes yet" : `${nodes.length} nodes`}
          </p>
        </div>
      </div>

      {nodes.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/3 px-5 text-center text-sm leading-6 text-white/55">
          当前工作流还没有节点。可以在空白画布右键，或使用空状态按钮创建第一个节点。
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {nodes.map((node, index) => {
            const isSelected = selectedNodeIdSet.has(node.id)

            return (
              <Button
                key={node.id}
                type="button"
                variant="ghost"
                onClick={() => onSelectNode(node.id)}
                className={cn(
                  "h-auto justify-start rounded-xl border border-transparent px-3 py-3 text-left shadow-none hover:bg-white/6",
                  isSelected &&
                    "border-sky-300/20 bg-sky-300/10 hover:bg-sky-300/10"
                )}
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-white/10 bg-white/6 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white/58 uppercase">
                      {node.type}
                    </span>
                    <span
                      className={cn(
                        "truncate text-sm font-medium",
                        isSelected ? "text-white" : "text-white/82"
                      )}
                    >
                      {getNodeDisplayTitle(node, index)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/45">
                    <span className="font-mono">{node.id}</span>
                    <span>
                      {Math.round(node.x)}, {Math.round(node.y)}
                    </span>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      )}
    </aside>
  )
}
