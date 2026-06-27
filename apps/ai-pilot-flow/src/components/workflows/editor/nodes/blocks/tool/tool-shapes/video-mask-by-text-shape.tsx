"use client"

import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

function VideoMaskByTextGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="2.1"
        y="3.15"
        width="11.8"
        height="8.85"
        rx="1.1"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path d="M6.55 5.55L10 7.6L6.55 9.65V5.55Z" fill="currentColor" />
      <rect
        x="10.3"
        y="8.85"
        width="5.15"
        height="5.15"
        rx="0.75"
        fill="#1b1c25"
        stroke="#1b1c25"
        strokeWidth="1.05"
      />
      <rect
        x="10.9"
        y="9.45"
        width="3.95"
        height="3.95"
        rx="0.55"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M11.7 10.45L13.7 12.45"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function renderVideoMaskByTextTitle({ title, tool }: ToolRendererProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <VideoMaskByTextGlyph className="size-4 text-white/82" />
      <span>{title || tool.label}</span>
    </span>
  )
}

export function renderVideoMaskByTextBody({ isRunning }: ToolRendererProps) {
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
