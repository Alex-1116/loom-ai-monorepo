"use client"

import { Upload } from "lucide-react"

export function renderImportLoraBody() {
  return (
    <div className="flex h-[100px] w-full items-center justify-center rounded-md border border-dashed border-white/10 bg-[#20222d]">
      <div className="flex flex-col items-center gap-3 p-4 text-center">
        <div className="flex size-9 items-center justify-center rounded-full border border-white/12 bg-white/4">
          <Upload className="size-4 text-white/80" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-white/72">Clock to Upload</p>
        </div>
      </div>
    </div>
  )
}
