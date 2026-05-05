"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"
import {
  Activity,
  Eraser,
  FolderOpen,
  LayoutGrid,
  Layers3,
  Plus,
  ScanSearch,
  Type,
} from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"

import { useCanvasBlockGestures } from "@/components/workflows/editor/interactions/hooks/useCanvasBlockGestures"

const toolbarItems: Array<{
  id: string
  label: string
  icon: LucideIcon
  isActive?: boolean
  hasDividerBefore?: boolean
}> = [
  {
    id: "select",
    label: "选择",
    icon: ScanSearch,
    isActive: true,
  },
  {
    id: "add",
    label: "新增节点",
    icon: Plus,
  },
  {
    id: "logic",
    label: "逻辑",
    icon: Activity,
  },
  {
    id: "erase",
    label: "擦除",
    icon: Eraser,
  },
  {
    id: "text",
    label: "文本",
    icon: Type,
  },
  {
    id: "layers",
    label: "图层",
    icon: Layers3,
    hasDividerBefore: true,
  },
  {
    id: "assets",
    label: "资源",
    icon: FolderOpen,
  },
  {
    id: "layout",
    label: "布局",
    icon: LayoutGrid,
  },
]

export function WorkflowCanvasLeftToolbar() {
  const toolbarRef = useCanvasBlockGestures<HTMLElement>()

  return (
    <aside ref={toolbarRef} className="pointer-events-auto">
      <div className="flex items-center justify-center rounded-4xl border border-black/8 bg-white/96 shadow-[0_10px_28px_rgba(15,23,42,0.10)]">
        <div className="flex w-full flex-col items-center gap-1 p-1.5">
          {toolbarItems.map(
            ({ id, label, icon: Icon, isActive, hasDividerBefore }) => (
              <React.Fragment key={id}>
                {/* divider 表示分组边界，本身不属于某个按钮项。 */}
                {hasDividerBefore ? (
                  <div className="h-px w-7 bg-slate-200" aria-hidden="true" />
                ) : null}

                <Button
                  aria-label={label}
                  title={label}
                  size="icon-sm"
                  variant="ghost"
                  className={cn(
                    "rounded-full text-slate-500 shadow-none hover:bg-slate-100 hover:text-slate-700",
                    isActive &&
                      "bg-slate-900 text-white hover:bg-slate-900 hover:text-white"
                  )}
                >
                  <Icon className="size-4" strokeWidth={2.2} />
                </Button>
              </React.Fragment>
            )
          )}
        </div>
      </div>
    </aside>
  )
}
