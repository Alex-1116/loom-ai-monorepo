import { WorkflowCanvasViewport } from "@/components/workflows/editor/canvas/canvas-viewport"

export default function WorkflowsPage() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-background">
      <main className="relative min-h-svh flex-1 overflow-hidden bg-[#0a0b12]">
        <WorkflowCanvasViewport />
      </main>
    </div>
  )
}
