"use client"

import { Upload } from "lucide-react"

import { Input } from "@loom/ui/components/input"
import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

function VideoIteratorGlyph({ className }: { className?: string }) {
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
      <path d="M6.2 5.35L10.25 8L6.2 10.65V5.35Z" fill="currentColor" />
    </svg>
  )
}

export function renderVideoIteratorTitle({ title, tool }: ToolRendererProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <VideoIteratorGlyph className="size-4 text-white/82" />
      <span>{title || tool.label}</span>
    </span>
  )
}

export function renderVideoIteratorBody({ isRunning }: ToolRendererProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div
        className={cn(
          "flex aspect-square items-center justify-center rounded-xl border border-white/6",
          "bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.03)_75%,rgba(255,255,255,0.03)),linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.03)_75%,rgba(255,255,255,0.03))] bg-[size:24px_24px] bg-[position:0_0,12px_12px]",
          isRunning &&
            "border-sky-400/20 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.1)]"
        )}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-9 items-center justify-center rounded-full border border-white/12 bg-white/4">
            <Upload className="size-4 text-white/80" />
          </div>
          <p className="text-sm text-white/78">
            Drag & drop or click to upload
          </p>
        </div>
      </div>

      <Input
        value="Paste a file link"
        readOnly
        className="rounded-md border-white/6 bg-transparent text-sm text-white/45"
      />
    </div>
  )
}
