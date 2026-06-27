"use client"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

function RouterGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M1.8 8H5.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.1 8L9.7 3.3H13.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.1 8L9.7 12.7H13.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.35 0.45L13.9 3L11.35 5.55"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.35 10.45L13.9 13L11.35 15.55"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function renderRouterTitle({ title, tool }: ToolRendererProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <RouterGlyph className="size-4 text-white/82" />
      <span>{title || tool.label}</span>
    </span>
  )
}
