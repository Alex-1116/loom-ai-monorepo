import { Button } from "@loom/ui/components/button"

import { PageShell } from "@/layouts/page-shell"
import { PlaceholderCard } from "@/layouts/placeholder-card"

const overviewStats = [
  {
    title: "Workflows",
    value: "0",
    description: "预留工作流列表与版本管理入口。",
  },
  {
    title: "Runs",
    value: "0",
    description: "预留任务执行、重试和日志追踪面板。",
  },
  {
    title: "Providers",
    value: "0",
    description: "预留模型网关与密钥配置区域。",
  },
] as const

const launchChecklist = [
  "补工作流管理页的列表与编辑器空路由",
  "补执行记录页的表格与筛选器空状态",
  "补系统设置页的模型、租户和权限分组",
] as const

export default function DashboardPage() {
  return (
    <PageShell
      eyebrow="Dashboard"
      title="AI Pilot Flow 工作台"
      description="当前为后台管理台空壳，用于承载工作流、执行记录和系统配置模块。"
      actions={
        <Button variant="outline" size="sm">
          新建占位模块
        </Button>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        {overviewStats.map((item) => (
          <PlaceholderCard
            key={item.title}
            title={item.title}
            description={item.description}
          >
            <div className="text-3xl font-semibold">{item.value}</div>
          </PlaceholderCard>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <PlaceholderCard
          title="模块概览"
          description="工作台首页用于承载关键入口、项目状态和待办提示。"
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              这里后续可以放入项目摘要、运行概览、模型成本和异常告警等核心视图。
            </p>
            <p>当前仅保留静态结构，方便后续按模块逐步补业务实现。</p>
          </div>
        </PlaceholderCard>

        <PlaceholderCard
          title="下一步建议"
          description="适合继续补的后台基础模块。"
        >
          <ul className="space-y-2 text-sm text-muted-foreground">
            {launchChecklist.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </PlaceholderCard>
      </section>
    </PageShell>
  )
}
