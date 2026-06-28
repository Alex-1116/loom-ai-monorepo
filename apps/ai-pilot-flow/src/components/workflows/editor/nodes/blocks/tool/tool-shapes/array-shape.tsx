"use client"

import { Ellipsis, Plus, X } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { Input } from "@loom/ui/components/input"
import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"
import { WorkflowNodeFooter } from "@/components/workflows/editor/nodes/shell/workflow-node-shell"

type ArrayItem = {
  id: string
  value: string
}

function parseItems(content?: string): ArrayItem[] {
  if (!content) {
    return [{ id: "item-1", value: "" }]
  }

  try {
    const parsed = JSON.parse(content) as unknown
    if (!Array.isArray(parsed)) {
      return [{ id: "item-1", value: "" }]
    }

    const items = parsed.flatMap((item, index) => {
      if (typeof item === "string") {
        return [{ id: `item-${index + 1}`, value: item }]
      }

      if (
        item &&
        typeof item === "object" &&
        "id" in item &&
        "value" in item &&
        typeof item.id === "string" &&
        typeof item.value === "string"
      ) {
        return [{ id: item.id, value: item.value }]
      }

      return []
    })

    return items.length > 0 ? items : [{ id: "item-1", value: "" }]
  } catch {
    return [{ id: "item-1", value: "" }]
  }
}

function serializeItems(items: ArrayItem[]) {
  return JSON.stringify(items)
}

function createNextItem(items: ArrayItem[]): ArrayItem {
  const nextIndex = items.length + 1
  return {
    id: `item-${Date.now()}-${nextIndex}`,
    value: "",
  }
}

function updateItems(
  items: ArrayItem[],
  onContentChange?: (value: string) => void,
  onContentCommit?: () => void
) {
  onContentChange?.(serializeItems(items))
  onContentCommit?.()
}

export function renderArrayHeaderActions({ content }: ToolRendererProps) {
  const items = parseItems(content)

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-white/68">
        {items.length} item{items.length !== 1 ? "s" : ""}
      </span>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label="Text Iterator 更多操作"
        className="rounded-md text-white/50 shadow-none hover:bg-white/6 hover:text-white"
        onPointerDown={(event) => {
          event.stopPropagation()
        }}
      >
        <Ellipsis className="size-4" />
      </Button>
    </div>
  )
}

export function renderArrayBody({
  content,
  onContentChange,
  onContentCommit,
}: ToolRendererProps) {
  const items = parseItems(content)

  return (
    <div className="flex w-full flex-col gap-2">
      {items.map((item) => (
        <div key={item.id} className="group/item flex items-center hover:gap-2">
          <Input
            value={item.value}
            onPointerDown={(event) => {
              event.stopPropagation()
            }}
            onClick={(event) => {
              event.stopPropagation()
            }}
            onChange={(event) => {
              const nextItems = items.map((currentItem) =>
                currentItem.id === item.id
                  ? {
                      ...currentItem,
                      value: event.target.value,
                    }
                  : currentItem
              )
              onContentChange?.(serializeItems(nextItems))
            }}
            onBlur={() => {
              onContentCommit?.()
            }}
            className={cn(
              "h-9 w-full rounded-md border border-white/10 bg-transparent px-4 text-sm text-white/82 placeholder:text-white/34"
            )}
            placeholder="Array item"
          />
          {items.length > 1 ? (
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="w-0 overflow-hidden rounded-md px-0 text-white/50 opacity-0 shadow-none transition-[width,opacity,padding] group-hover/item:w-8 group-hover/item:px-0 group-hover/item:opacity-100 hover:bg-white/6 hover:text-white"
              onPointerDown={(event) => {
                event.stopPropagation()
              }}
              onClick={(event) => {
                event.stopPropagation()
                updateItems(
                  items.filter((currentItem) => currentItem.id !== item.id),
                  onContentChange,
                  onContentCommit
                )
              }}
            >
              <X className="size-4 text-white/72" />
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function renderArrayFooter({
  content,
  onContentChange,
  onContentCommit,
}: ToolRendererProps) {
  const items = parseItems(content)

  return (
    <WorkflowNodeFooter
      leftActions={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-sm text-sm font-medium text-white/88 shadow-none hover:bg-white/6 hover:text-white"
          onPointerDown={(event) => {
            event.stopPropagation()
          }}
          onClick={(event) => {
            event.stopPropagation()
            if (items.length >= 50) {
              return
            }

            updateItems(
              [...items, createNextItem(items)],
              onContentChange,
              onContentCommit
            )
          }}
        >
          <Plus className="mr-1 size-4" />
          Add item
        </Button>
      }
    />
  )
}
