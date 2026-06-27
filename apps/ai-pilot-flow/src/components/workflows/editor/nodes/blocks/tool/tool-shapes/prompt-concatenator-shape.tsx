"use client"

import { Textarea } from "@loom/ui/components/textarea"
import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

export function renderPromptConcatenatorBody({
  content = "",
  isRunning,
  onContentChange,
  onContentCommit,
}: ToolRendererProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className={cn(
          "min-h-[188px] w-full rounded-xl border border-white/6 bg-white/6 px-5 py-4 text-sm leading-6 text-white/26",
          isRunning &&
            "border-sky-400/20 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.1)]"
        )}
      >
        Connect multiple prompts to one output prompt.
      </div>

      <Textarea
        value={content ?? ""}
        onChange={(event) => {
          onContentChange?.(event.target.value)
        }}
        onBlur={onContentCommit}
        placeholder="Write additional text"
        className={cn(
          "min-h-[188px] resize-none rounded-xl border border-white/6 bg-white/6 px-5 py-4 text-sm leading-6 text-white/92 placeholder:text-white/26",
          isRunning &&
            "border-sky-400/20 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.1)]"
        )}
      />
    </div>
  )
}
