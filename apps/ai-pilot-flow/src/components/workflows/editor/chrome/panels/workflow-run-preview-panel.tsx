"use client"

import * as React from "react"

import { Play, X } from "lucide-react"

import { Button } from "@loom/ui/components/button"
import { cn } from "@loom/ui/lib/utils"

import { useCanvasBlockGestures } from "@/components/workflows/editor/interactions/hooks/useCanvasBlockGestures"
import type { WorkflowRunResult } from "@/components/workflows/shared/types/workflow-runtime"

type WorkflowRunPreviewPanelProps = {
  isRunning: boolean
  result: WorkflowRunResult | null
  errorMessage?: string | null
  onClose?: () => void
}

function formatRuntimeValue(value: unknown) {
  return JSON.stringify(value, null, 2)
}

function getPanelSubtitle({
  isRunning,
  result,
  errorMessage,
}: {
  isRunning: boolean
  result: WorkflowRunResult | null
  errorMessage?: string | null
}) {
  if (isRunning) {
    return "正在执行当前工作流..."
  }

  if (result) {
    return `最近一次运行状态：${result.status}`
  }

  if (errorMessage?.startsWith("运行前校验未通过")) {
    return "最近一次运行在开始前被校验阻断"
  }

  return "最近一次运行发生错误"
}

export function WorkflowRunPreviewPanel({
  isRunning,
  result,
  errorMessage,
  onClose,
}: WorkflowRunPreviewPanelProps) {
  const panelRef = useCanvasBlockGestures<HTMLDivElement>({
    preventWheelDefault: false,
  })
  const isVisible = isRunning || result !== null || Boolean(errorMessage)

  if (!isVisible) {
    return null
  }

  return (
    <aside
      ref={panelRef}
      className="pointer-events-auto flex h-full w-full max-w-full min-w-0 flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-[#171821]/96 p-4 text-white shadow-[0_24px_64px_rgba(0,0,0,0.48)] backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-sky-400/12 p-1.5 text-sky-200">
              <Play className="size-4" strokeWidth={2.2} />
            </div>
            <p className="text-sm font-semibold text-white">Run Preview</p>
          </div>
          <p className="text-xs break-words text-white/45">
            {getPanelSubtitle({
              isRunning,
              result,
              errorMessage,
            })}
          </p>
        </div>

        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="关闭运行预览"
          title="关闭运行预览"
          onClick={onClose}
          className="rounded-lg text-white/55 shadow-none hover:bg-white/6 hover:text-white"
        >
          <X className="size-4" strokeWidth={2.2} />
        </Button>
      </div>

      {isRunning ? (
        <div className="rounded-xl border border-sky-400/20 bg-sky-400/10 px-3 py-2 text-sm text-sky-100">
          Runtime 正在按当前拓扑顺序执行节点。
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-rose-400/25 bg-rose-400/10 px-3 py-2 text-sm leading-6 text-rose-100">
          {errorMessage}
        </div>
      ) : null}

      {result ? (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto pr-1">
          <section className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold tracking-wide text-white/45 uppercase">
              Summary
            </h3>
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/8 bg-white/4 p-3 text-xs text-white/65">
              <div className="space-y-1">
                <p className="text-white/40">Status</p>
                <p
                  className={cn(
                    "font-medium capitalize",
                    result.status === "failed"
                      ? "text-rose-200"
                      : "text-emerald-200"
                  )}
                >
                  {result.status}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-white/40">Steps</p>
                <p className="font-medium text-white/82">
                  {result.order.length}
                </p>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold tracking-wide text-white/45 uppercase">
              Execution Order
            </h3>
            <div className="rounded-xl border border-white/8 bg-white/4 p-3">
              <p className="text-sm leading-6 break-all text-white/75">
                {result.order.join(" -> ")}
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold tracking-wide text-white/45 uppercase">
              Node States
            </h3>
            <div className="flex flex-col gap-2">
              {result.nodeStates.map((nodeState) => (
                <div
                  key={nodeState.nodeId}
                  className="rounded-xl border border-white/8 bg-white/4 p-3 text-sm"
                >
                  <div className="mb-2 flex min-w-0 items-center justify-between gap-3">
                    <p className="truncate font-medium text-white/88">
                      {nodeState.nodeId}
                    </p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
                        nodeState.status === "failed"
                          ? "bg-rose-400/14 text-rose-100"
                          : "bg-emerald-400/14 text-emerald-100"
                      )}
                    >
                      {nodeState.status}
                    </span>
                  </div>
                  {nodeState.error ? (
                    <p className="break-words text-rose-100">
                      {nodeState.error}
                    </p>
                  ) : (
                    <pre className="overflow-x-auto rounded-lg bg-black/20 p-2 text-xs leading-5 text-white/72">
                      <code>{formatRuntimeValue(nodeState.output)}</code>
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold tracking-wide text-white/45 uppercase">
              Outputs
            </h3>
            <pre className="overflow-x-auto rounded-xl border border-white/8 bg-black/20 p-3 text-xs leading-5 text-white/72">
              <code>{formatRuntimeValue(result.outputs)}</code>
            </pre>
          </section>
        </div>
      ) : null}
    </aside>
  )
}
