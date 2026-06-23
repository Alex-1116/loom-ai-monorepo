"use client"

import { Plus } from "lucide-react"

import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

export function renderColorPaletteBody({ isRunning }: ToolRendererProps) {
  return (
    <div className="relative w-full">
      <div
        className={cn(
          "aspect-square w-full rounded-[14px] bg-[#1f212b]",
          "flex items-center justify-center",
          isRunning && "shadow-[inset_0_0_0_1px_rgba(56,189,248,0.14)]"
        )}
        style={{
          backgroundImage:
            "linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.04) 75%, rgba(255,255,255,0.04)), linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.04) 75%, rgba(255,255,255,0.04))",
          backgroundPosition: "0 0, 12px 12px",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-8 items-center justify-center rounded-full border border-white/45 bg-white/8 text-white/90">
            <Plus className="size-4" />
          </div>
          <div className="text-[18px] font-medium text-white/72">
            Select color
          </div>
        </div>
      </div>

      {isRunning ? (
        <div className="pointer-events-none absolute inset-0 rounded-[14px] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_60%)]" />
      ) : null}
    </div>
  )
}
