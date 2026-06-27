"use client"

import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

function VideoDescriberGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2.35 4.15V2.85C2.35 2.57 2.57 2.35 2.85 2.35H11.15C11.43 2.35 11.65 2.57 11.65 2.85V6.75"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.2 11.65H2.85C2.57 11.65 2.35 11.43 2.35 11.15V8.95"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5.6 4.9L8.55 6.85L5.6 8.8V4.9Z" fill="currentColor" />
      <path
        d="M9.55 8.15H13.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M6.95 10.35H13.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M5.6 12.55H13.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function renderVideoDescriberTitle({ title, tool }: ToolRendererProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <VideoDescriberGlyph className="size-4 text-white/82" />
      <span>{title || tool.label}</span>
    </span>
  )
}

export function renderVideoDescriberBody({ isRunning }: ToolRendererProps) {
  return (
    <div className="flex w-full flex-col">
      <div
        className={cn(
          "min-h-[378px] w-full rounded-xl border border-white/6 bg-white/6 px-5 py-4 text-sm leading-6 text-white/24",
          isRunning &&
            "border-sky-400/20 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.1)]"
        )}
      >
        The generated text will appear here
      </div>
    </div>
  )
}
