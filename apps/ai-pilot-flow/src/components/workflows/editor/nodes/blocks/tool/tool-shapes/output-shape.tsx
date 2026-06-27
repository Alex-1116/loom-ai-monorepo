"use client"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

function OutputGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="1.65"
        y="2.35"
        width="12.7"
        height="11.3"
        rx="1.1"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <path
        d="M7 5.55L10.15 8L7 10.45V5.55Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function renderOutputTitle({ title, tool }: ToolRendererProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <OutputGlyph className="size-4 text-white/82" />
      <span>{title || tool.label}</span>
    </span>
  )
}
