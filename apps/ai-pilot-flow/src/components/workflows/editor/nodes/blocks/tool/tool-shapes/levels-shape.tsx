"use client"

import { ChevronDown } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"
import { WorkflowNodeFooter } from "@/components/workflows/editor/nodes/shell/workflow-node-shell"

function ValueBox({ value, className }: { value: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-7 items-center rounded-md border border-white/7 bg-white/[0.03] px-3 text-sm font-medium text-white/82",
        className
      )}
    >
      {value}
    </div>
  )
}

function LevelsLine({
  markers,
}: {
  markers: Array<"start" | "middle" | "end">
}) {
  return (
    <div className="relative h-5 flex-1">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/18" />
      {markers.map((marker) => {
        const position =
          marker === "start"
            ? "left-0"
            : marker === "middle"
              ? "left-1/2 -translate-x-1/2"
              : "right-0"

        return (
          <div
            key={marker}
            className={cn(
              "absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full border border-white/30 bg-[#1f212b]",
              marker !== "end" && "bg-[#11131a]",
              position
            )}
          />
        )
      })}
    </div>
  )
}

export function renderLevelsBody({ isRunning }: ToolRendererProps) {
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

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[84px_minmax(0,1fr)] items-center gap-4">
          <div className="text-sm text-white/62">Channel</div>
          <div className="flex h-7 max-w-[116px] items-center justify-between rounded-md border border-white/7 bg-white/[0.03] px-3 text-sm font-medium text-white/82">
            <span>RGB</span>
            <ChevronDown className="size-4 text-white/72" />
          </div>
        </div>

        <div className="grid grid-cols-[84px_minmax(0,1fr)] items-start gap-4">
          <div className="pt-1 text-sm text-white/62">Histogram</div>
          <div className="flex h-[92px] items-center justify-center rounded-[6px] bg-white/[0.04] text-sm text-white/52">
            No data
          </div>
        </div>

        <div className="grid grid-cols-[84px_minmax(0,1fr)] items-start gap-4">
          <div className="pt-2 text-sm text-white/62">Inputs</div>
          <div className="flex flex-col gap-2.5">
            <LevelsLine markers={["start", "middle", "end"]} />
            <div className="grid grid-cols-3 gap-3">
              <ValueBox value="0" className="justify-start" />
              <ValueBox value="1.00" className="justify-center" />
              <ValueBox value="255" className="justify-end" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[84px_minmax(0,1fr)] items-start gap-4">
          <div className="pt-2 text-sm text-white/62">Outputs</div>
          <div className="flex flex-col gap-2.5">
            <LevelsLine markers={["start", "end"]} />
            <div className="grid grid-cols-2 gap-3">
              <ValueBox value="0" className="justify-start" />
              <ValueBox value="255" className="justify-end" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function renderLevelsFooter() {
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
