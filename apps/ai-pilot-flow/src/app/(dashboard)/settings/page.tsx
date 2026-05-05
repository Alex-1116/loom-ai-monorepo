import { Button } from "@loom/ui/components/button"

import { PageShell } from "@/layouts/page-shell"
import { PlaceholderCard } from "@/layouts/placeholder-card"

const settingSections = [
  {
    title: "Model Providers",
    description: "预留模型供应商、密钥和路由策略设置。",
  },
  {
    title: "Workspace",
    description: "预留租户、成员、权限和基础信息配置。",
  },
  {
    title: "Observability",
    description: "预留日志、告警和使用量统计相关设置。",
  },
] as const

export default function SettingsPage() {
  return (
    <PageShell
      eyebrow="Settings"
      title="系统设置"
      description="用于承载模型接入、租户管理和平台配置等后台能力。"
      actions={
        <Button variant="outline" size="sm">
          保存占位配置
        </Button>
      }
    >
      <section className="grid gap-4 lg:grid-cols-3">
        {settingSections.map((section) => (
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
