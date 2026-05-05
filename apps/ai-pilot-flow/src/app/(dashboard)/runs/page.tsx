import { Button } from "@loom/ui/components/button"

import { PageShell } from "@/layouts/page-shell"
import { PlaceholderCard } from "@/layouts/placeholder-card"

const runSections = [
  {
    title: "Run Queue",
    description: "预留任务队列、触发方式和并发状态。",
  },
  {
    title: "Execution Logs",
    description: "预留节点日志、错误详情和断点恢复入口。",
  },
  {
    title: "Retry Center",
    description: "预留失败任务重试、取消和批量处理能力。",
  },
] as const

export default function RunsPage() {
  return (
    <PageShell
      eyebrow="Runs"
      title="执行记录"
      description="用于承载工作流运行历史、队列状态和异常处理入口。"
      actions={
        <Button variant="outline" size="sm">
          刷新占位数据
        </Button>
      }
    >
      <section className="grid gap-4 lg:grid-cols-3">
        {runSections.map((section) => (
          <PlaceholderCard
            key={section.title}
            title={section.title}
            description={section.description}
          >
            <div className="rounded-xl border border-dashed px-4 py-8 text-sm text-muted-foreground">
              当前仅保留结构占位，后续在这里接入对应模块。
            </div>
          </PlaceholderCard>
        ))}
      </section>
    </PageShell>
  )
}
