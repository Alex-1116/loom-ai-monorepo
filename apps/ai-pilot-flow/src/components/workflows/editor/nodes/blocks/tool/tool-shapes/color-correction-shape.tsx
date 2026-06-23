"use client"

import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"
import { WorkflowNodeFooter } from "@/components/workflows/editor/nodes/shell/workflow-node-shell"

const CONTROL_ROWS = [
  { label: "Exposure", value: "0.00" },
  { label: "Contrast", value: "0" },
  { label: "Saturation", value: "0" },
  { label: "Temperature", value: "0" },
  { label: "Tint", value: "0" },
  { label: "Highlights", value: "0" },
  { label: "Shadows", value: "0" },
] as const

function SliderRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[78px_minmax(0,1fr)_48px] items-center gap-3">
      <div className="text-sm text-white/62">{label}</div>
      <div className="relative h-5">
        <div className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-white/18" />
        <div className="absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.18)]" />
      </div>
      <div className="flex h-7 items-center justify-center rounded-md border border-white/7 bg-white/[0.03] text-sm font-medium text-white/78">
        {value}
      </div>
    </div>
  )
}

export function renderColorCorrectionBody({ isRunning }: ToolRendererProps) {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="relative w-full">
        <div
          className={cn(
            "aspect-square w-full rounded-[14px] bg-[#1f212b]",
            isRunning && "shadow-[inset_0_0_0_1px_rgba(56,189,248,0.14)]"
          )}
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.04) 75%, rgba(255,255,255,0.04)), linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.04) 75%, rgba(255,255,255,0.04))",
            backgroundPosition: "0 0, 12px 12px",
            backgroundSize: "24px 24px",
          }}
        />

        {isRunning ? (
          <div className="pointer-events-none absolute inset-0 rounded-[14px] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_60%)]" />
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        {CONTROL_ROWS.map((row) => (
          <SliderRow key={row.label} label={row.label} value={row.value} />
        ))}
      </div>
    </div>
  )
}

export function renderColorCorrectionFooter() {
  return (
    <WorkflowNodeFooter
      rightActions={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-sm text-sm font-medium text-white/78 shadow-none hover:bg-white/6 hover:text-white"
          onPointerDown={(event) => {
            event.stopPropagation()
          }}
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          Reset
        </Button>
      }
    />
  )
}
