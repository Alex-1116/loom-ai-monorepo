"use client"

import { Upload } from "lucide-react"
import { Input } from "@loom/ui/components/input"

import type { FileRendererProps } from "@/components/workflows/editor/model/constants/file-definitions"

export function renderFileBody({ title }: FileRendererProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div
        className="flex aspect-square items-center justify-center rounded-xl border border-white/6"
        style={{
          backgroundImage:
            "linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.03) 75%, rgba(255,255,255,0.03)), linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.03) 75%, rgba(255,255,255,0.03))",
          backgroundPosition: "0 0, 12px 12px",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-9 items-center justify-center rounded-full border border-white/12 bg-white/4">
            <Upload className="size-4 text-white/80" />
          </div>
          <p className="text-sm text-white/72">
            Drag & drop or click to upload
          </p>
        </div>
      </div>

      <Input
        value={`Paste a ${title?.toLowerCase() ?? "file"} link`}
        readOnly
        className="rounded-md border-white/6 bg-white/4 text-sm text-white/45"
      />
    </div>
  )
}
