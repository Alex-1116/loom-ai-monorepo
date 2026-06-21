"use client"

import {
  ChevronDown,
  Hand,
  MousePointer2,
  Redo2,
  RotateCcw,
  Undo2,
} from "lucide-react"

import { Button } from "@loom/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@loom/ui/components/dropdown-menu"
import { cn } from "@loom/ui/lib/utils"

import { useCanvasBlockGestures } from "@/components/workflows/editor/interactions/hooks/useCanvasBlockGestures"

export const workflowCanvasToolItems = [
  {
    id: "select",
    label: "选择",
    icon: MousePointer2,
  },
  {
    id: "hand",
    label: "平移",
    icon: Hand,
  },
] as const

export type WorkflowCanvasTool = (typeof workflowCanvasToolItems)[number]["id"]

const zoomItems = [
  {
    label: "Zoom in",
    shortcut: "⌘+",
    action: "zoomIn",
  },
  {
    label: "Zoom out",
    shortcut: "⌘−",
    action: "zoomOut",
  },
  {
    label: "Zoom to 100%",
    shortcut: "⌘0",
    action: "reset",
  },
  {
    label: "Zoom to fit",
    shortcut: "⌘1",
    action: "fit",
  },
] as const

type WorkflowCanvasBottomToolbarProps = {
  activeTool: WorkflowCanvasTool
  zoomLabel: string
  onToolChange: (tool: WorkflowCanvasTool) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
  onZoomFit: () => void
  onResetView?: () => void
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
}

export function WorkflowCanvasBottomToolbar({
  activeTool,
  zoomLabel,
  onToolChange,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onZoomFit,
  onResetView,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: WorkflowCanvasBottomToolbarProps) {
  const toolbarRef = useCanvasBlockGestures<HTMLDivElement>()
  const dropdownContentRef = useCanvasBlockGestures<HTMLDivElement>()
  // dropdown item 的 action 统一收敛在这里，避免 JSX 内部散落多段分支。
  const zoomActions = {
    zoomIn: onZoomIn,
    zoomOut: onZoomOut,
    reset: onZoomReset,
    fit: onZoomFit,
  } as const

  return (
    <div
      ref={toolbarRef}
      className="pointer-events-auto flex items-center gap-1 rounded-xl bg-[#1d1e27]/96 p-1.5 shadow-[0_18px_48px_rgba(0,0,0,0.42)] backdrop-blur-xl"
    >
      {workflowCanvasToolItems.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label={label}
          title={label}
          onClick={() => onToolChange(id)}
          className={cn(
            "rounded-lg text-white/65 shadow-none hover:bg-white/6 hover:text-white",
            activeTool === id &&
              "bg-[#eef59a] text-slate-900 hover:bg-[#eef59a] hover:text-slate-900"
          )}
        >
          <Icon className="size-4" strokeWidth={2.2} />
        </Button>
      ))}

      <div className="h-6 w-px bg-secondary" aria-hidden="true" />

      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        disabled={!canUndo}
        aria-label="撤销"
        title="撤销"
        onClick={onUndo}
        className="rounded-lg text-white/55 shadow-none hover:bg-white/6 hover:text-white disabled:pointer-events-none disabled:opacity-40"
      >
        <Undo2 className="size-4" strokeWidth={2.2} />
      </Button>

      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        disabled={!canRedo}
        aria-label="重做"
        title="重做"
        onClick={onRedo}
        className="rounded-lg text-white/55 shadow-none hover:bg-white/6 hover:text-white disabled:pointer-events-none disabled:opacity-40"
      >
        <Redo2 className="size-4" strokeWidth={2.2} />
      </Button>

      <div className="h-6 w-px bg-secondary" aria-hidden="true" />

      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label="重置视图"
        title="重置视图"
        onClick={onResetView}
        className="rounded-lg text-white/65 shadow-none hover:bg-white/6 hover:text-white"
      >
        <RotateCcw className="size-4" strokeWidth={2.2} />
      </Button>

      <div className="h-6 w-px bg-secondary" aria-hidden="true" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="w-auto justify-between rounded-lg bg-white/8 text-sm font-medium text-white shadow-none hover:bg-white/12 hover:text-white"
          >
            <span>{zoomLabel}</span>
            <ChevronDown className="size-4 text-white/75" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          ref={dropdownContentRef}
          side="top"
          align="start"
          sideOffset={14}
          data-workflow-overlay
          className="w-20 rounded-lg border border-white/10 bg-[#1d1e27]/98 p-1 text-white shadow-[0_18px_48px_rgba(0,0,0,0.42)] ring-0"
        >
          {zoomItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onSelect={zoomActions[item.action]}
              className="rounded-lg px-2 py-1 text-sm font-medium text-white/95 focus:bg-white/6 focus:text-white"
            >
              <span>{item.label}</span>
              <DropdownMenuShortcut className="text-sm tracking-normal text-white/60">
                {item.shortcut}
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
