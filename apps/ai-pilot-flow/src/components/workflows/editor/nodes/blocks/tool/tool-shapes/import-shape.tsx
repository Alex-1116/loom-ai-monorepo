"use client"

import { Upload } from "lucide-react"

import { Input } from "@loom/ui/components/input"
import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

export function renderImportBody({ isRunning }: ToolRendererProps) {
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
            Drag &amp; drop or click to upload
          </p>
        </div>
      </div>

      <Input
        placeholder="Paste a file link"
        readOnly
        className="rounded-md border-white/6 bg-transparent text-sm text-white/45"
      />
    </div>
  )
}
