"use client"

import { Ellipsis, Plus, X } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { Input } from "@loom/ui/components/input"
import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"
import { WorkflowNodeFooter } from "@/components/workflows/editor/nodes/shell/workflow-node-shell"

type TextIteratorItem = {
  id: string
  value: string
}

function TextIteratorGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M1.15 6.25C1.15 3.85 3.35 2.15 6.05 2.15H13.7"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.45 0.95L13.7 2.15L12.45 3.35"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.85 9.75C14.85 12.15 12.65 13.85 9.95 13.85H2.3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.55 15.05L2.3 13.85L3.55 12.65"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.55 5.1H10.45"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M8 5.1V10.95"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function parseItems(content?: string): TextIteratorItem[] {
  if (!content) {
    return []
  }

  try {
    const parsed = JSON.parse(content) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.flatMap((item, index) => {
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
  } catch {
    return []
  }
}

function serializeItems(items: TextIteratorItem[]) {
  return JSON.stringify(items)
}

function normalizeItemLabels(items: TextIteratorItem[]) {
  return items.map((item, index) => ({
    ...item,
    value: /^Item \d+$/.test(item.value) ? `Item ${index + 1}` : item.value,
  }))
}

function createNextItem(items: TextIteratorItem[]): TextIteratorItem {
  const nextIndex = items.length + 1
  return {
    id: `item-${Date.now()}-${nextIndex}`,
    value: `Item ${nextIndex}`,
  }
}

function updateItems(
  items: TextIteratorItem[],
  onContentChange?: (value: string) => void,
  onContentCommit?: () => void
) {
  onContentChange?.(serializeItems(normalizeItemLabels(items)))
  onContentCommit?.()
}

export function renderTextIteratorTitle({ title, tool }: ToolRendererProps) {
  return (
    <span className="inline-flex items-center gap-3">
      <TextIteratorGlyph className="size-4 text-white/82" />
      <span>{title || tool.label}</span>
    </span>
  )
}

export function renderTextIteratorHeaderActions({
  content,
}: ToolRendererProps) {
  const items = parseItems(content)

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-white/68">
        {items.length}/50
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

export function renderTextIteratorBody({
  content,
  onContentChange,
  onContentCommit,
}: ToolRendererProps) {
  const items = parseItems(content)

  if (items.length === 0) {
    return null
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {items.map((item, index) => (
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
            placeholder={`Item ${index + 1}`}
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

export function renderTextIteratorFooter({
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
          Add another item
        </Button>
      }
    />
  )
}
