import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@loom/ui/components/card"

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
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <section className="grid gap-4 lg:grid-cols-3">
          {runSections.map((section) => (
            <Card className="aspect-[16/9] bg-muted/50" key={section.title}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1">
                <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed px-4 py-8 text-sm text-muted-foreground">
                  当前仅保留结构占位，后续在这里接入对应模块。
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  )
}
