"use client"

import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

function MaskByTextGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <rect x="2" y="2" width="1.8" height="12" rx="0.2" />
      <rect x="2" y="2" width="12" height="1.8" rx="0.2" />

      <rect x="5.1" y="4.7" width="1.8" height="9.3" rx="0.2" />
      <rect x="5.1" y="4.7" width="8.9" height="1.8" rx="0.2" />

      <rect x="8.2" y="7.4" width="1.8" height="6.6" rx="0.2" />
      <rect x="8.2" y="7.4" width="5.8" height="1.8" rx="0.2" />
    </svg>
  )
}

export function renderMaskByTextTitle({ title, tool }: ToolRendererProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <MaskByTextGlyph className="size-4 text-white/82" />
      <span>{title || tool.label}</span>
    </span>
  )
}

export function renderMaskByTextBody({ isRunning }: ToolRendererProps) {
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
