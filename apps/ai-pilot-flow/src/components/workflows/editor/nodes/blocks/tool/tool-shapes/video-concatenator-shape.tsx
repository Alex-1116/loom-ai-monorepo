"use client"

import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

function VideoConcatenatorGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M1.75 4.5H6.25L9 7.25H14.25"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.75 5.5L14.25 7.25L10.75 9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.75 11.5H6.25L7.5 10.25"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function renderVideoConcatenatorTitle({
  title,
  tool,
}: ToolRendererProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <VideoConcatenatorGlyph className="size-4 text-white/82" />
      <span>{title || tool.label}</span>
    </span>
  )
}

export function renderVideoConcatenatorBody({ isRunning }: ToolRendererProps) {
  return (
    <div className="flex w-full flex-col">
      <div className="relative w-full overflow-hidden rounded-xl">
        <div
          className={cn(
            "aspect-square w-full rounded-xl bg-[linear-gradient(45deg,rgba(255,255,255,0.06)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.06)_75%,rgba(255,255,255,0.06)),linear-gradient(45deg,rgba(255,255,255,0.06)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.06)_75%,rgba(255,255,255,0.06))] bg-[size:24px_24px] bg-[position:0_0,12px_12px]",
            "bg-[#2a2c33]",
            isRunning && "shadow-[inset_0_0_0_1px_rgba(56,189,248,0.16)]"
          )}
        />
      </div>
    </div>
  )
}
