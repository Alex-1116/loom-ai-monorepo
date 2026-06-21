"use client"

import * as React from "react"
import { ChevronRight, Search } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { Input } from "@loom/ui/components/input"
import { cn } from "@loom/ui/lib/utils"

import { useCanvasBlockGestures } from "@/components/workflows/editor/interactions/hooks/useCanvasBlockGestures"
import {
  workflowNodeMenuItems,
  type WorkflowNodeType,
} from "@/components/workflows/editor/nodes/registry/workflow-node-registry"

type MenuItem = {
  label: string
  hasChildren?: boolean
  nodeType?: WorkflowNodeType
}

const menuItems: readonly MenuItem[] = [
  ...workflowNodeMenuItems.map((item) => ({
    label: item.label,
    nodeType: item.type,
  })),
  { label: "Preview" },
  { label: "Import Model" },
  { label: "Import LoRA" },
  { label: "Import Multiple LoRAs" },
  { label: "Runway Gen-4.5" },
  { label: "Tools", hasChildren: true },
  { label: "Image models", hasChildren: true },
  { label: "Video models", hasChildren: true },
  { label: "3D models", hasChildren: true },
  { label: "Custom models", hasChildren: true },
] as const

const MENU_WIDTH = 388
const MENU_HEIGHT = 620
const MENU_MARGIN = 16

function clampPosition(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function WorkflowCanvasContextMenu({
  children,
  className,
  onSelectItem,
}: React.PropsWithChildren<{
  className?: string
  onSelectItem?: (payload: {
    type: WorkflowNodeType
    clientX: number
    clientY: number
  }) => void
}>) {
  const surfaceRef = React.useRef<HTMLDivElement | null>(null)
  const menuRef = React.useRef<HTMLDivElement | null>(null)
  const gestureBlockRef = useCanvasBlockGestures<HTMLDivElement>()
  const [isOpen, setIsOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [position, setPosition] = React.useState({ x: 24, y: 24 })
  const [triggerPoint, setTriggerPoint] = React.useState({
    clientX: 0,
    clientY: 0,
  })

  const filteredItems = React.useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) {
      return menuItems
    }

    return menuItems.filter((item) =>
      item.label.toLowerCase().includes(keyword)
    )
  }, [search])

  const openMenu = React.useCallback((clientX: number, clientY: number) => {
    const surface = surfaceRef.current
    if (!surface) {
      return
    }

    const rect = surface.getBoundingClientRect()
    const nextX = clampPosition(
      clientX - rect.left,
      MENU_MARGIN,
      Math.max(MENU_MARGIN, rect.width - MENU_WIDTH - MENU_MARGIN)
    )
    const nextY = clampPosition(
      clientY - rect.top,
      MENU_MARGIN,
      Math.max(MENU_MARGIN, rect.height - MENU_HEIGHT - MENU_MARGIN)
    )

    // 菜单面板会被限制在容器内，但节点创建仍然使用用户真实右键点击的位置。
    setPosition({ x: nextX, y: nextY })
    setTriggerPoint({ clientX, clientY })
    setIsOpen(true)
    setSearch("")
  }, [])

  React.useEffect(() => {
    if (!isOpen) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current?.contains(event.target as Node)) {
        return
      }

      setIsOpen(false)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("pointerdown", handlePointerDown)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  return (
    <div
      ref={surfaceRef}
      className={cn("relative h-full w-full", className)}
      onContextMenu={(event) => {
        if ((event.target as HTMLElement).closest("[data-workflow-overlay]")) {
          return
        }

        event.preventDefault()
        openMenu(event.clientX, event.clientY)
      }}
    >
      {children}

      {isOpen ? (
        <div
          ref={(node) => {
            menuRef.current = node
            gestureBlockRef(node)
          }}
          className="absolute z-30 flex w-[200px] flex-col gap-1.5 rounded-xl border border-white/10 bg-[#1c1d26]/98 p-1.5 text-white shadow-[0_18px_48px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          style={{ left: position.x, top: position.y }}
        >
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/60" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              className="h-8 rounded-2xl border-white/25 bg-white/4 pr-4 pl-11 text-base text-white placeholder:text-white/45 focus-visible:border-white/35 focus-visible:ring-white/10"
            />
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            {filteredItems.map((item) => (
              <Button
                key={item.label}
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-3 rounded-md text-left text-xs font-medium text-white/95 shadow-none hover:bg-white/6 hover:text-white focus-visible:ring-white/10",
                  item.hasChildren && "pr-3"
                )}
                onClick={() => {
                  if (!item.nodeType) {
                    return
                  }

                  onSelectItem?.({
                    type: item.nodeType,
                    clientX: triggerPoint.clientX,
                    clientY: triggerPoint.clientY,
                  })
                  setIsOpen(false)
                }}
              >
                <span className="flex-1">{item.label}</span>
                {item.hasChildren ? (
                  <ChevronRight className="size-4 text-white/70" />
                ) : null}
              </Button>
            ))}

            {filteredItems.length === 0 ? (
              <div className="px-4 py-6 text-sm text-white/50">
                未找到匹配项
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
