"use client"

import * as React from "react"
import { Download, Eraser, Grid3X3, Brush, Pipette } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"

import type { ToolRendererProps } from "@/components/workflows/editor/model/constants/tool-definitions"

type PainterMode = "brush" | "eraser" | "picker"

const PAINTER_TOOL_OPTIONS: Array<{
  mode: PainterMode
  label: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  { mode: "brush", label: "Brush", icon: Brush },
  { mode: "eraser", label: "Eraser", icon: Eraser },
  { mode: "picker", label: "Color picker", icon: Pipette },
]

function stopPointer(event: React.PointerEvent<HTMLElement>) {
  event.stopPropagation()
}

function formatHexColor(value: string) {
  return value.replace("#", "").toUpperCase()
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`
}

function PainterToolbarButton({
  isActive,
  label,
  children,
  onClick,
}: React.PropsWithChildren<{
  isActive?: boolean
  label: string
  onClick?: () => void
}>) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      className={cn(
        "rounded-sm border border-white/10 bg-transparent text-white/72 shadow-none hover:bg-white/6 hover:text-white",
        isActive &&
          "border-[#e6ec8f]/60 bg-[#e6ec8f] text-[#15171d] hover:bg-[#eef39f]"
      )}
      onPointerDown={stopPointer}
      onClick={(event) => {
        event.stopPropagation()
        onClick?.()
      }}
    >
      {children}
    </Button>
  )
}

function PainterSlider({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      className="h-2 w-full cursor-pointer accent-white"
      onPointerDown={stopPointer}
      onChange={(event) => {
        onChange(Number(event.target.value))
      }}
    />
  )
}

function PainterValueField({
  value,
  className,
}: {
  value: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex h-9 items-center rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm font-medium text-white/82",
        className
      )}
    >
      {value}
    </div>
  )
}

export function renderPainterTitle({ title, tool }: ToolRendererProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <Brush className="size-4 text-white/82" />
      <span>{title || tool.label}</span>
    </span>
  )
}

export function renderPainterBody({ isRunning }: ToolRendererProps) {
  const [mode, setMode] = React.useState<PainterMode>("brush")
  const [color, setColor] = React.useState("#ffffff")
  const [opacity, setOpacity] = React.useState(100)
  const [size, setSize] = React.useState(30)
  const [hardness, setHardness] = React.useState(100)
  const [showGrid, setShowGrid] = React.useState(true)

  const resetControls = React.useCallback(() => {
    setMode("brush")
    setColor("#ffffff")
    setOpacity(100)
    setSize(30)
    setHardness(100)
    setShowGrid(true)
  }, [])

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="group/canvas relative w-full overflow-hidden rounded-xl bg-black">
        <div
          className={cn(
            "aspect-square w-full rounded-xl bg-black transition-shadow",
            showGrid &&
              "bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]",
            isRunning && "shadow-[inset_0_0_0_1px_rgba(163,230,53,0.18)]"
          )}
        />

        <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.15),rgba(0,0,0,0.82)_72%)]" />

        <div className="pointer-events-none absolute top-1/2 left-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-lime-300/90 shadow-[0_0_0_1px_rgba(190,242,100,0.2)]" />

        <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover/canvas:opacity-100">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Download painter result"
            className="rounded-sm border border-white/10 bg-black/40 text-white/80 shadow-none backdrop-blur-sm hover:bg-black/60 hover:text-white"
            onPointerDown={stopPointer}
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <Download className="size-4" />
          </Button>
        </div>

        <div className="pointer-events-none absolute bottom-3 left-3 opacity-0 transition-opacity group-hover/canvas:opacity-100">
          <span className="text-sm font-medium tracking-[0.01em] text-white/88">
            1024x1024
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {PAINTER_TOOL_OPTIONS.map(
            ({ mode: optionMode, label, icon: Icon }) => (
              <PainterToolbarButton
                key={optionMode}
                label={label}
                isActive={mode === optionMode}
                onClick={() => {
                  setMode(optionMode)
                }}
              >
                <Icon className="size-4" />
              </PainterToolbarButton>
            )
          )}

          <PainterToolbarButton
            label="Toggle grid"
            isActive={showGrid}
            onClick={() => {
              setShowGrid((current) => !current)
            }}
          >
            <Grid3X3 className="size-4" />
          </PainterToolbarButton>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-sm text-sm font-medium text-white/78 shadow-none hover:bg-white/6 hover:text-white"
          onPointerDown={stopPointer}
          onClick={(event) => {
            event.stopPropagation()
            resetControls()
          }}
        >
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-[72px_minmax(0,1fr)_72px] items-center gap-3">
        <div className="text-sm text-white/62">Color</div>
        <div className="flex items-center gap-2">
          <label
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/[0.03]"
            onPointerDown={stopPointer}
          >
            <input
              type="color"
              value={color}
              className="sr-only"
              onPointerDown={stopPointer}
              onChange={(event) => {
                setColor(event.target.value)
              }}
            />
            <span
              className="size-5 rounded-sm border border-white/20"
              style={{ backgroundColor: color }}
            />
          </label>
          <PainterValueField
            value={formatHexColor(color)}
            className="min-w-0 flex-1 justify-start"
          />
        </div>
        <PainterValueField
          value={formatPercent(opacity)}
          className="justify-center"
        />
      </div>

      <div className="grid grid-cols-[72px_minmax(0,1fr)_72px] items-center gap-3">
        <div className="text-sm text-white/62">Size</div>
        <PainterSlider value={size} min={1} max={100} onChange={setSize} />
        <PainterValueField value={String(size)} className="justify-center" />
      </div>

      <div className="grid grid-cols-[72px_minmax(0,1fr)_72px] items-center gap-3">
        <div className="text-sm text-white/62">Hardness</div>
        <PainterSlider
          value={hardness}
          min={0}
          max={100}
          onChange={setHardness}
        />
        <PainterValueField
          value={formatPercent(hardness)}
          className="justify-center"
        />
      </div>
    </div>
  )
}
