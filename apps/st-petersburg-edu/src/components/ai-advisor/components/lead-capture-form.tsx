"use client"

import { useMemo, useState, type ChangeEvent } from "react"
import { UserRoundPlus } from "lucide-react"
import { Badge } from "@loom/ui/components/badge"
import { Button } from "@loom/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@loom/ui/components/card"
import { Input } from "@loom/ui/components/input"
import { Textarea } from "@loom/ui/components/textarea"
import { cn } from "@loom/ui/lib/utils"
import {
  createEmptyLeadDraft,
  useAiAdvisor,
  type LeadDraft,
} from "@/src/components/ai-advisor/provider"

const EDUCATION_LEVELS = ["高中", "中专/职高", "大专", "本科", "在职提升"]
const TARGET_DEGREES = ["预科", "本科", "硕士", "还不确定"]
const TARGET_INTAKES = ["2026 秋季", "2026 冬季", "尽快入学", "还未确定"]
const BUDGET_RANGES = ["5 万以内", "5 到 8 万", "8 到 12 万", "12 万以上"]
const FOCUS_TOPICS = ["预算", "认证", "好毕业", "专业选择", "流程效率"]

function OptionGrid({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option === value

          return (
            <button
              key={option}
              type="button"
              className={cn(
                "rounded-full border px-3 py-2 text-sm transition-all",
                selected
                  ? "border-primary/35 bg-primary/12 text-primary shadow-[0_12px_24px_-20px_rgba(37,99,235,0.35)]"
                  : "border-border bg-background text-muted-foreground hover:-translate-y-0.5 hover:border-primary/25 hover:bg-muted hover:text-foreground"
              )}
              onClick={() => onChange(option)}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function LeadCaptureForm() {
  const { submitLead } = useAiAdvisor()
  const [lead, setLead] = useState<LeadDraft>(createEmptyLeadDraft)

  const isComplete = useMemo(
    () =>
      Boolean(
        lead.name &&
        lead.educationLevel &&
        lead.targetDegree &&
        lead.targetIntake &&
        lead.budgetRange &&
        lead.contact
      ),
    [lead]
  )

  const updateInput =
    (field: keyof LeadDraft) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setLead((current) => ({ ...current, [field]: event.target.value }))
    }

  const updateValue = (field: keyof LeadDraft, value: string) => {
    setLead((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()

    if (!isComplete) {
      return
    }

    submitLead(lead)
  }

  return (
    <Card className="border border-border/20 bg-card py-5 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.16)]">
      <CardHeader className="gap-3">
        <Badge className="w-fit bg-[linear-gradient(135deg,rgba(68,82,255,0.95),rgba(96,165,250,0.9))] text-white">
          免费初步评估
        </Badge>
        <CardTitle className="text-lg text-card-foreground">
          3 分钟拿到更具体的建议
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          先留基础信息，方便顾问结合你的预算、学历和时间规划给出更具体建议。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              value={lead.name}
              onChange={updateInput("name")}
              placeholder="姓名或称呼"
              className="border-input bg-background text-foreground placeholder:text-muted-foreground"
            />
            <Input
              value={lead.contact}
              onChange={updateInput("contact")}
              placeholder="微信 / 手机号"
              className="border-input bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <OptionGrid
            label="当前学历"
            options={EDUCATION_LEVELS}
            value={lead.educationLevel}
            onChange={(value) => updateValue("educationLevel", value)}
          />

          <OptionGrid
            label="计划申请层次"
            options={TARGET_DEGREES}
            value={lead.targetDegree}
            onChange={(value) => updateValue("targetDegree", value)}
          />

          <OptionGrid
            label="目标入学时间"
            options={TARGET_INTAKES}
            value={lead.targetIntake}
            onChange={(value) => updateValue("targetIntake", value)}
          />

          <OptionGrid
            label="预算区间"
            options={BUDGET_RANGES}
            value={lead.budgetRange}
            onChange={(value) => updateValue("budgetRange", value)}
          />

          <OptionGrid
            label="当前更关注什么"
            options={FOCUS_TOPICS}
            value={lead.focusTopic}
            onChange={(value) => updateValue("focusTopic", value)}
          />

          <Textarea
            value={lead.notes}
            onChange={updateInput("notes")}
            placeholder="也可以补充你的情况，比如目前学历、预算顾虑、是否着急入学"
            className="min-h-24 rounded-[1.25rem] border-input bg-background text-foreground placeholder:text-muted-foreground"
          />

          <Button
            type="submit"
            size="lg"
            className="w-full bg-[linear-gradient(135deg,rgba(68,82,255,0.98),rgba(59,130,246,0.94))] text-white shadow-[0_20px_36px_-24px_rgba(37,99,235,0.55)] hover:opacity-95 dark:shadow-[0_24px_42px_-24px_rgba(59,130,246,0.5)]"
            disabled={!isComplete}
          >
            提交评估信息
            <UserRoundPlus className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
