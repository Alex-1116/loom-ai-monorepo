"use client"

import { ListTree } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"

import { useCanvasBlockGestures } from "@/components/workflows/editor/interactions/hooks/useCanvasBlockGestures"

type WorkflowCanvasViewToolbarProps = {
  isOutlineVisible: boolean
  onToggleOutline: () => void
}

export function WorkflowCanvasViewToolbar({
  isOutlineVisible,
  onToggleOutline,
}: WorkflowCanvasViewToolbarProps) {
  const toolbarRef = useCanvasBlockGestures<HTMLDivElement>()

  return (
    <div
      ref={toolbarRef}
      className="pointer-events-auto flex items-center gap-1 rounded-xl bg-[#1d1e27]/96 p-1.5 shadow-[0_18px_48px_rgba(0,0,0,0.42)] backdrop-blur-xl"
    >
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label={isOutlineVisible ? "隐藏 Outline" : "显示 Outline"}
        title={isOutlineVisible ? "隐藏 Outline" : "显示 Outline"}
        onClick={onToggleOutline}
        className={cn(
          "rounded-lg text-white/65 shadow-none hover:bg-white/6 hover:text-white",
          isOutlineVisible &&
            "bg-[#eef59a] text-slate-900 hover:bg-[#eef59a] hover:text-slate-900"
        )}
      >
        <ListTree className="size-4" strokeWidth={2.2} />
      </Button>
    </div>
  )
}
