"use client"

import * as React from "react"
import { ChevronRight, Search } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { Input } from "@loom/ui/components/input"
import { cn } from "@loom/ui/lib/utils"

import { useCanvasBlockGestures } from "@/components/workflows/editor/interactions/hooks/useCanvasBlockGestures"
import {
  THREE_D_MODEL_MENU_CATEGORIES,
  createThreeDModelNodeData,
} from "@/components/workflows/editor/model/constants/3d-model-presets"
import {
  IMAGE_MODEL_MENU_CATEGORIES,
  createImageModelNodeData,
} from "@/components/workflows/editor/model/constants/image-model-presets"
import {
  TOOL_MENU_CATEGORIES,
  createToolNodeData,
} from "@/components/workflows/editor/model/constants/tool-presets"
import {
  VIDEO_MODEL_MENU_CATEGORIES,
  createVideoModelNodeData,
} from "@/components/workflows/editor/model/constants/video-model-presets"
import type { WorkflowNodeData } from "@/components/workflows/editor/model/types/workflow-node"
import {
  workflowNodeMenuItems,
  type WorkflowNodeType,
} from "@/components/workflows/editor/nodes/registry/workflow-node-registry"

type MenuActionItem = {
  id: string
  label: string
  nodeType: WorkflowNodeType
  nodeData?: Partial<WorkflowNodeData>
}

type MenuBranchItem = {
  id: string
  label: string
  children: readonly MenuItem[]
}

type MenuItem = MenuActionItem | MenuBranchItem

type SearchMenuItem = MenuActionItem & {
  breadcrumb: string[]
}

function isMenuBranchItem(item: MenuItem): item is MenuBranchItem {
  return "children" in item
}

function flattenSearchItems(
  items: readonly MenuItem[],
  breadcrumb: string[] = []
): SearchMenuItem[] {
  return items.flatMap((item) => {
    if (isMenuBranchItem(item)) {
      return flattenSearchItems(item.children, [...breadcrumb, item.label])
    }

    return [
      {
        ...item,
        breadcrumb,
      },
    ]
  })
}

function findBranchChildren(
  items: readonly MenuItem[],
  path: readonly string[]
): readonly MenuItem[] {
  let currentItems = items

  for (const itemId of path) {
    const nextBranch = currentItems.find(
      (item): item is MenuBranchItem =>
        isMenuBranchItem(item) && item.id === itemId
    )
    if (!nextBranch) {
      return []
    }

    currentItems = nextBranch.children
  }

  return currentItems
}

const imageModelMenuItems: readonly MenuItem[] =
  IMAGE_MODEL_MENU_CATEGORIES.map((category) => ({
    id: category.id,
    label: category.label,
    children: category.presets.map((preset) => ({
      id: preset.id,
      label: preset.label,
      nodeType: "image-model" as const,
      nodeData: createImageModelNodeData({
        title: preset.label,
        modelKey: preset.modelKey,
        mode: category.id,
      }),
    })),
  }))

const videoModelMenuItems: readonly MenuItem[] =
  VIDEO_MODEL_MENU_CATEGORIES.map((category) => ({
    id: category.id,
    label: category.label,
    children: category.presets.map((preset) => ({
      id: preset.id,
      label: preset.label,
      nodeType: "video-model" as const,
      nodeData: createVideoModelNodeData({
        title: preset.label,
        modelKey: preset.modelKey,
        mode: category.id,
      }),
    })),
  }))

const threeDModelMenuItems: readonly MenuItem[] =
  THREE_D_MODEL_MENU_CATEGORIES.map((category) => ({
    id: category.id,
    label: category.label,
    children: category.presets.map((preset) => ({
      id: preset.id,
      label: preset.label,
      nodeType: "3d-model" as const,
      nodeData: createThreeDModelNodeData({
        title: preset.label,
        modelKey: preset.modelKey,
        mode: category.id,
      }),
    })),
  }))

const toolMenuItems: readonly MenuItem[] = TOOL_MENU_CATEGORIES.map(
  (category) => ({
    id: category.id,
    label: category.label,
    children: category.presets.map((preset) => ({
      id: preset.id,
      label: preset.label,
      nodeType: "tool" as const,
      nodeData: createToolNodeData({
        title: preset.label,
        toolKey: preset.toolKey,
        category: category.label,
        inputPorts: preset.inputPorts,
        outputPorts: preset.outputPorts,
        addInputLabel: preset.addInputLabel,
        runLabel: preset.runLabel,
        showAddInputAction: preset.showAddInputAction,
        showRunAction: preset.showRunAction,
      }),
    })),
  })
)

const menuItems: readonly MenuItem[] = [
  ...workflowNodeMenuItems
    .filter(
      (item) =>
        item.type !== "image-model" &&
        item.type !== "video-model" &&
        item.type !== "3d-model" &&
        item.type !== "tool"
    )
    .map((item) => ({
      id: item.type,
      label: item.label,
      nodeType: item.type,
    })),
  {
    id: "runway-gen-4-5",
    label: "Runway Gen-4.5",
    nodeType: "image-model",
    nodeData: createImageModelNodeData({
      title: "Runway Gen-4.5",
      modelKey: "runway-gen-4-5",
      mode: "generate-from-text",
    }),
  },
  {
    id: "saved",
    label: "Saved",
    children: [],
  },
  {
    id: "tools",
    label: "Tools",
    children: toolMenuItems,
  },
  {
    id: "image-models",
    label: "Image models",
    children: imageModelMenuItems,
  },
  {
    id: "video-models",
    label: "Video models",
    children: videoModelMenuItems,
  },
  {
    id: "3d-models",
    label: "3D models",
    children: threeDModelMenuItems,
  },
  {
    id: "custom-models",
    label: "Custom models",
    children: [],
  },
] as const

const MENU_FALLBACK_WIDTH = 200
const MENU_FALLBACK_HEIGHT = 620
const MENU_MARGIN = 16
const MENU_PANEL_GAP = 8
const allSearchItems = flattenSearchItems(menuItems)

function clampPosition(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getClampedMenuPosition({
  clientX,
  clientY,
  surfaceRect,
  menuWidth,
  menuHeight,
}: {
  clientX: number
  clientY: number
  surfaceRect: DOMRect
  menuWidth: number
  menuHeight: number
}) {
  return {
    x: clampPosition(
      clientX - surfaceRect.left,
      MENU_MARGIN,
      Math.max(MENU_MARGIN, surfaceRect.width - menuWidth - MENU_MARGIN)
    ),
    y: clampPosition(
      clientY - surfaceRect.top,
      MENU_MARGIN,
      Math.max(MENU_MARGIN, surfaceRect.height - menuHeight - MENU_MARGIN)
    ),
  }
}

export function WorkflowCanvasContextMenu({
  children,
  className,
  onSelectItem,
}: React.PropsWithChildren<{
  className?: string
  onSelectItem?: (payload: {
    type: WorkflowNodeType
    data?: Partial<WorkflowNodeData>
    clientX: number
    clientY: number
  }) => void
}>) {
  const surfaceRef = React.useRef<HTMLDivElement | null>(null)
  const menuRef = React.useRef<HTMLDivElement | null>(null)
  const gestureBlockRef = useCanvasBlockGestures<HTMLDivElement>()
  const [isOpen, setIsOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [activePath, setActivePath] = React.useState<string[]>([])
  const [submenuTops, setSubmenuTops] = React.useState<number[]>([])
  const [position, setPosition] = React.useState({ x: 24, y: 24 })
  const [panelMaxHeight, setPanelMaxHeight] =
    React.useState(MENU_FALLBACK_HEIGHT)
  const [triggerPoint, setTriggerPoint] = React.useState({
    clientX: 0,
    clientY: 0,
  })

  const filteredItems = React.useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) {
      return allSearchItems
    }

    return allSearchItems.filter(
      (item) =>
        item.label.toLowerCase().includes(keyword) ||
        item.breadcrumb.some((part) => part.toLowerCase().includes(keyword))
    )
  }, [search])

  const visiblePanels = React.useMemo(() => {
    if (search.trim()) {
      return []
    }

    return Array.from({ length: activePath.length + 1 }, (_, index) =>
      findBranchChildren(menuItems, activePath.slice(0, index))
    ).filter((items) => items.length > 0)
  }, [activePath, search])

  const isSearching = search.trim().length > 0
  const panelCount = isSearching ? 1 : Math.max(1, visiblePanels.length)
  const menuWidth =
    MENU_FALLBACK_WIDTH * panelCount + MENU_PANEL_GAP * (panelCount - 1)

  const getRelativePanelTop = React.useCallback(
    (element: HTMLElement, nextPanelItems: readonly MenuItem[]) => {
      const menuRect = menuRef.current?.getBoundingClientRect()
      const surfaceRect = surfaceRef.current?.getBoundingClientRect()
      const itemRect = element.getBoundingClientRect()

      if (!menuRect || !surfaceRect) {
        return 0
      }

      const ITEM_HEIGHT = 28
      const PADDING = 10
      const MAX_HEIGHT = Math.max(0, surfaceRect.height - MENU_MARGIN * 2)

      const estimatedHeight = Math.min(
        MAX_HEIGHT,
        PADDING + nextPanelItems.length * ITEM_HEIGHT
      )

      let topOffset = itemRect.top - menuRect.top
      const absoluteTop = menuRect.top + topOffset
      const absoluteBottom = absoluteTop + estimatedHeight
      const maxAllowedBottom = surfaceRect.bottom - MENU_MARGIN

      if (absoluteBottom > maxAllowedBottom) {
        topOffset -= absoluteBottom - maxAllowedBottom
      }

      const minAllowedTop = surfaceRect.top + MENU_MARGIN
      if (menuRect.top + topOffset < minAllowedTop) {
        topOffset = minAllowedTop - menuRect.top
      }

      return topOffset
    },
    []
  )

  const openMenu = React.useCallback(
    (clientX: number, clientY: number) => {
      const surface = surfaceRef.current
      if (!surface) {
        return
      }

      const rect = surface.getBoundingClientRect()
      const nextPanelMaxHeight = Math.max(0, rect.height - MENU_MARGIN * 2)
      setPanelMaxHeight(nextPanelMaxHeight)

      // 如果菜单还未渲染，则预估一个初始高度。最大不超过画布高度。
      const estimatedMenuHeight = Math.min(
        nextPanelMaxHeight,
        MENU_FALLBACK_HEIGHT
      )

      const nextPosition = getClampedMenuPosition({
        clientX,
        clientY,
        surfaceRect: rect,
        menuWidth: menuRef.current?.offsetWidth ?? menuWidth,
        menuHeight: menuRef.current?.offsetHeight ?? estimatedMenuHeight,
      })

      // 菜单面板会被限制在容器内，但节点创建仍然使用用户真实右键点击的位置。
      setPosition(nextPosition)
      setTriggerPoint({ clientX, clientY })
      setIsOpen(true)
      setSearch("")
      setActivePath([])
      setSubmenuTops([])
    },
    [menuWidth]
  )

  React.useLayoutEffect(() => {
    if (!isOpen) {
      return
    }

    const surface = surfaceRef.current
    const menu = menuRef.current
    if (!surface || !menu) {
      return
    }

    const nextPosition = getClampedMenuPosition({
      clientX: triggerPoint.clientX,
      clientY: triggerPoint.clientY,
      surfaceRect: surface.getBoundingClientRect(),
      menuWidth: menu.offsetWidth,
      menuHeight: menu.offsetHeight,
    })
    setPanelMaxHeight(
      Math.max(0, surface.getBoundingClientRect().height - MENU_MARGIN * 2)
    )

    setPosition((current) =>
      current.x === nextPosition.x && current.y === nextPosition.y
        ? current
        : nextPosition
    )
  }, [
    filteredItems.length,
    isOpen,
    menuWidth,
    triggerPoint.clientX,
    triggerPoint.clientY,
    visiblePanels.length,
  ])

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

  const handleSelectAction = React.useCallback(
    (item: MenuActionItem) => {
      onSelectItem?.({
        type: item.nodeType,
        data: item.nodeData,
        clientX: triggerPoint.clientX,
        clientY: triggerPoint.clientY,
      })
      setIsOpen(false)
    },
    [onSelectItem, triggerPoint.clientX, triggerPoint.clientY]
  )

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
          className="absolute z-30 text-white"
          style={{ left: position.x, top: position.y, width: `${menuWidth}px` }}
        >
          <div className="relative flex w-[200px] flex-col gap-1 rounded-xl border border-white/10 bg-[#1c1d26]/98 p-1.5 shadow-[0_18px_48px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/60" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setActivePath([])
                  setSubmenuTops([])
                }}
                placeholder="Search"
                className="h-7 rounded-xl border-white/25 bg-white/4 pr-3 pl-10 text-sm text-white placeholder:text-white/45 focus-visible:border-white/35 focus-visible:ring-white/10"
              />
            </div>

            <div
              className="overflow-y-auto"
              style={{ maxHeight: `${panelMaxHeight}px` }}
            >
              {isSearching
                ? filteredItems.map((item) => (
                    <Button
                      key={`${item.breadcrumb.join("/")}:${item.id}`}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-full justify-start gap-2 rounded-md px-2.5 text-left text-[11px] font-medium text-white/95 shadow-none hover:bg-white/6 hover:text-white focus-visible:ring-white/10"
                      onClick={() => {
                        handleSelectAction(item)
                      }}
                    >
                      <span className="flex-1 truncate">{item.label}</span>
                      <span className="truncate text-[10px] text-white/40">
                        {item.breadcrumb.join(" / ")}
                      </span>
                    </Button>
                  ))
                : menuItems.map((item) => {
                    const hasChildren = isMenuBranchItem(item)

                    return (
                      <Button
                        key={item.id}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 w-full justify-start gap-2 rounded-md px-2.5 text-left text-[11px] font-medium text-white/95 shadow-none hover:bg-white/6 hover:text-white focus-visible:ring-white/10",
                          hasChildren && "pr-3"
                        )}
                        onPointerEnter={(event) => {
                          if (!hasChildren) {
                            return
                          }

                          setSubmenuTops([
                            getRelativePanelTop(
                              event.currentTarget,
                              item.children
                            ),
                          ])
                          setActivePath([item.id])
                        }}
                        onClick={() => {
                          if (isMenuBranchItem(item)) {
                            setActivePath([item.id])
                            return
                          }

                          handleSelectAction(item)
                        }}
                      >
                        <span className="flex-1 truncate">{item.label}</span>
                        {hasChildren ? (
                          <ChevronRight className="size-4 text-white/70" />
                        ) : null}
                      </Button>
                    )
                  })}

              {(isSearching && filteredItems.length === 0) ||
              (!isSearching && menuItems.length === 0) ? (
                <div className="px-4 py-6 text-sm text-white/50">
                  未找到匹配项
                </div>
              ) : null}
            </div>
          </div>

          {!isSearching
            ? visiblePanels.slice(1).map((panelItems, panelIndex) => (
                <div
                  key={`panel-${panelIndex + 1}`}
                  className="absolute flex w-[200px] flex-col gap-1 rounded-xl border border-white/10 bg-[#1c1d26]/98 p-1.5 shadow-[0_18px_48px_rgba(0,0,0,0.55)] backdrop-blur-xl"
                  style={{
                    left: `${(panelIndex + 1) * (MENU_FALLBACK_WIDTH + MENU_PANEL_GAP)}px`,
                    top: `${submenuTops[panelIndex] ?? 0}px`,
                  }}
                >
                  <div
                    className="overflow-y-auto"
                    style={{ maxHeight: `${panelMaxHeight}px` }}
                  >
                    {panelItems.map((item) => {
                      const hasChildren = isMenuBranchItem(item)

                      return (
                        <Button
                          key={item.id}
                          type="button"
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-7 w-full justify-start gap-2 rounded-md px-2.5 text-left text-[11px] font-medium text-white/95 shadow-none hover:bg-white/6 hover:text-white focus-visible:ring-white/10",
                            hasChildren && "pr-3"
                          )}
                          onPointerEnter={(event) => {
                            if (!hasChildren) {
                              return
                            }

                            const nextTop = getRelativePanelTop(
                              event.currentTarget,
                              item.children
                            )
                            setActivePath((current) => [
                              ...current.slice(0, panelIndex + 1),
                              item.id,
                            ])
                            setSubmenuTops((current) => [
                              ...current.slice(0, panelIndex + 1),
                              nextTop,
                            ])
                          }}
                          onClick={() => {
                            if (isMenuBranchItem(item)) {
                              setActivePath((current) => [
                                ...current.slice(0, panelIndex + 1),
                                item.id,
                              ])
                              return
                            }

                            handleSelectAction(item)
                          }}
                        >
                          <span className="flex-1 truncate">{item.label}</span>
                          {hasChildren ? (
                            <ChevronRight className="size-4 text-white/70" />
                          ) : null}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              ))
            : null}
        </div>
      ) : null}
    </div>
  )
}
