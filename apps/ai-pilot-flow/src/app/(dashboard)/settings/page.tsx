import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@loom/ui/components/card"

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
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <section className="grid gap-4 lg:grid-cols-3">
          {settingSections.map((section) => (
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
