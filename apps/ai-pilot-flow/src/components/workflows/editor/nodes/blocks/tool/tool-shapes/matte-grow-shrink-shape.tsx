"use client"

import * as React from "react"

import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

function MatteGrowShrinkGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M6.25 2.75H2.75V6.25"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.75 2.75L5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M9.75 2.75H13.25V6.25"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.25 2.75L10.5 5.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M6.25 13.25H2.75V9.75"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.75 13.25L5.5 10.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M9.75 13.25H13.25V9.75"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.25 13.25L10.5 10.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <rect
        x="5.55"
        y="5.55"
        width="4.9"
        height="4.9"
        rx="0.35"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M6.7 6.7L9.3 9.3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function clampSize(value: number) {
  if (Number.isNaN(value)) {
    return 1
  }

  return Math.min(Math.max(Math.round(value), 1), 100)
}

function SizeValueField({ value }: { value: number }) {
  return (
    <div className="flex h-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm font-medium text-white/84">
      {value}
    </div>
  )
}

export function renderMatteGrowShrinkTitle({ title, tool }: ToolRendererProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <MatteGrowShrinkGlyph className="size-4 text-white/82" />
      <span>{title || tool.label}</span>
    </span>
  )
}

export function renderMatteGrowShrinkBody({ isRunning }: ToolRendererProps) {
  const [size, setSize] = React.useState(1)

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="relative w-full overflow-hidden rounded-xl">
        <div
          className={cn(
            "aspect-square w-full rounded-xl bg-[linear-gradient(45deg,rgba(255,255,255,0.06)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.06)_75%,rgba(255,255,255,0.06)),linear-gradient(45deg,rgba(255,255,255,0.06)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.06)_75%,rgba(255,255,255,0.06))] bg-[size:24px_24px] bg-[position:0_0,12px_12px]",
            "bg-[#2a2c33]",
            isRunning && "shadow-[inset_0_0_0_1px_rgba(56,189,248,0.16)]"
          )}
        />
      </div>

      <div className="grid grid-cols-[auto_minmax(0,1fr)_56px] items-center gap-3">
        <div className="text-sm text-white/62">Size</div>
        <input
          type="range"
          min={1}
          max={100}
          value={size}
          className="h-2 w-full cursor-pointer accent-white"
          onPointerDown={(event) => {
            event.stopPropagation()
          }}
          onChange={(event) => {
            setSize(clampSize(Number(event.target.value)))
          }}
        />
        <SizeValueField value={size} />
      </div>
    </div>
  )
}
