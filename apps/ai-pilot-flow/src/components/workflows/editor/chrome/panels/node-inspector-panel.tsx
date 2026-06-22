"use client"

import * as React from "react"

import { Input } from "@loom/ui/components/input"
import { Textarea } from "@loom/ui/components/textarea"
import { cn } from "@loom/ui/lib/utils"

import { useCanvasBlockGestures } from "@/components/workflows/editor/interactions/hooks/useCanvasBlockGestures"
import { getWorkflowNodeSchema } from "@/components/workflows/editor/model/schema/workflow-schema"
import type { WorkflowNodeFieldKey } from "@/components/workflows/editor/model/schema/node-schema"
import type { WorkflowCanvasNode } from "@/components/workflows/editor/model/types/workflow-node"
import { validateNode } from "@/components/workflows/editor/services/validators/validate-node"

type WorkflowNodeInspectorPanelProps = {
  selectedCount: number
  selectedNode: WorkflowCanvasNode | null
  onPatchNode: (
    nodeId: string,
    patch: Partial<NonNullable<WorkflowCanvasNode["data"]>>
  ) => void
  onCommitChanges?: () => void
}

function Section({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold tracking-wide text-white/45 uppercase">
        {title}
      </h3>
      {children}
    </section>
  )
}

function Field({
  label,
  children,
}: React.PropsWithChildren<{ label: string }>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-white/65">{label}</span>
      {children}
    </label>
  )
}

export function WorkflowNodeInspectorPanel({
  selectedCount,
  selectedNode,
  onPatchNode,
  onCommitChanges,
}: WorkflowNodeInspectorPanelProps) {
  const panelRef = useCanvasBlockGestures<HTMLDivElement>()
  const nodeSchema = React.useMemo(
    () => (selectedNode ? getWorkflowNodeSchema(selectedNode.type) : null),
    [selectedNode]
  )
  const validationIssues = React.useMemo(
    () => (selectedNode ? validateNode(selectedNode).issues : []),
    [selectedNode]
  )
  const handleFieldChange = React.useCallback(
    (nodeId: string, fieldKey: WorkflowNodeFieldKey, value: string) => {
      onPatchNode(nodeId, {
        [fieldKey]: value,
      })
    },
    [onPatchNode]
  )

  return (
    <aside
      ref={panelRef}
      className="pointer-events-auto flex h-full w-[320px] flex-col rounded-2xl border border-white/10 bg-[#171821]/96 p-4 text-white shadow-[0_24px_64px_rgba(0,0,0,0.48)] backdrop-blur-xl"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Node Inspector</p>
          <p className="text-xs text-white/45">
            {selectedNode
              ? `Editing ${selectedNode.type} node`
              : selectedCount > 1
                ? `${selectedCount} nodes selected`
                : "Select a node to inspect"}
          </p>
        </div>
      </div>

      {!selectedNode && selectedCount === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/3 px-5 text-center text-sm leading-6 text-white/55">
          请选择一个节点以查看和编辑它的配置。
        </div>
      ) : null}

      {!selectedNode && selectedCount > 1 ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/3 px-5 text-center text-sm leading-6 text-white/55">
          当前为多选状态。请只保留一个节点选中后再编辑具体配置。
        </div>
      ) : null}

      {selectedNode ? (
        <div className="-m-1 flex flex-1 flex-col gap-5 overflow-y-auto p-1">
          <Section title="Meta">
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/8 bg-white/4 p-3 text-xs text-white/65">
              <div className="space-y-1">
                <p className="text-white/40">Type</p>
                <p className="font-medium text-white/82">{selectedNode.type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-white/40">ID</p>
                <p className="truncate font-mono text-[11px] text-white/72">
                  {selectedNode.id}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-white/40">X</p>
                <p className="font-medium text-white/82">
                  {Math.round(selectedNode.x)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-white/40">Y</p>
                <p className="font-medium text-white/82">
                  {Math.round(selectedNode.y)}
                </p>
              </div>
            </div>
          </Section>

          <Section title="Content">
            {nodeSchema?.fields.map((field) => (
              <Field key={field.key} label={field.label}>
                {field.input === "textarea" ? (
                  <Textarea
                    value={selectedNode.data?.[field.key] ?? ""}
                    onChange={(event) =>
                      handleFieldChange(
                        selectedNode.id,
                        field.key,
                        event.target.value
                      )
                    }
                    onBlur={onCommitChanges}
                    className="min-h-36 border-white/10 bg-white/4 text-white placeholder:text-white/30"
                    placeholder={field.placeholder}
                  />
                ) : (
                  <Input
                    value={selectedNode.data?.[field.key] ?? ""}
                    onChange={(event) =>
                      handleFieldChange(
                        selectedNode.id,
                        field.key,
                        event.target.value
                      )
                    }
                    onBlur={onCommitChanges}
                    className="border-white/10 bg-white/4 text-white placeholder:text-white/30"
                    placeholder={field.placeholder}
                  />
                )}
              </Field>
            ))}
          </Section>

          <Section title="Validation">
            {validationIssues.length > 0 ? (
              <div className="flex flex-col gap-2">
                {validationIssues.map((issue) => (
                  <div
                    key={issue.code}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-sm leading-6",
                      issue.level === "error"
                        ? "border-rose-400/25 bg-rose-400/10 text-rose-100"
                        : "border-amber-400/25 bg-amber-400/10 text-amber-100"
                    )}
                  >
                    {issue.message}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
                当前节点校验通过。
              </div>
            )}
          </Section>
        </div>
      ) : null}
    </aside>
  )
}
