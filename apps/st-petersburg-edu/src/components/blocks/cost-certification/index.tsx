"use client"

import {
  BadgeCheck,
  BriefcaseBusiness,
  CircleDollarSign,
  Home,
  Landmark,
  TrendingUp,
} from "lucide-react"
import { motion } from "framer-motion"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@loom/ui/components/card"

import { AdvisorTriggerButton } from "@/src/components/ai-advisor"
import { SectionHeading } from "@/src/components/blocks/section-heading"
import {
  cardReveal,
  sectionReveal,
  staggerContainer,
  viewportOnce,
} from "@/src/lib/motion"

const stats = [
  {
    label: "本/硕学费",
    value: "2 万+ / 年",
    note: "远低于欧美主流留学成本",
    icon: CircleDollarSign,
  },
  {
    label: "校内宿舍",
    value: "80-250 / 月",
    note: "预算更容易控制",
    icon: Home,
  },
  {
    label: "年总预算",
    value: "5-6 万",
    note: "适合工薪家庭规划",
    icon: TrendingUp,
  },
]

const certifications = [
  "学位受中国教育部认可，可按规定进行学历认证",
  "回国后在考公、落户、求职等使用场景更明确",
  "对看重学历回报率的家庭而言，路径更清晰",
]

const careerDirections = [
  "中俄跨境贸易与物流",
  "交通运输与运营管理",
  "国际商务与企业管理",
  "“一带一路”相关岗位机会",
]

export function CostCertification() {
  return (
    <section id="costs" className="scroll-mt-24 py-24 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <SectionHeading
            badge="费用与认证"
            title="把家长最关心的成本、认证和回报说清楚"
            description="这一部分决定的是用户是否会继续往下看。不是简单喊便宜，而是把费用结构、学历使用价值和职业方向讲透。"
          />
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="grid gap-4">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="grid gap-4 sm:grid-cols-3"
            >
              {stats.map((item) => (
                <motion.div
                  key={item.label}
                  variants={cardReveal}
                  whileHover={{ y: -6 }}
                >
                  <Card className="h-full border border-border/20 bg-card/80 shadow-[0_18px_70px_-48px_rgba(31,39,90,0.35)]">
                    <CardHeader>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <p className="pt-4 text-sm font-medium text-muted-foreground">
                        {item.label}
                      </p>
                      <CardTitle className="text-3xl tracking-tight">
                        {item.value}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-7 text-muted-foreground">
                        {item.note}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={sectionReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              whileHover={{ y: -4 }}
            >
              <Card className="border border-border/20 bg-[linear-gradient(135deg,rgba(79,94,255,0.08),rgba(255,200,97,0.1))] shadow-[0_18px_70px_-48px_rgba(31,39,90,0.35)]">
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <CardTitle className="pt-4 text-2xl">学历认证价值</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="grid gap-3"
                  >
                    {certifications.map((item) => (
                      <motion.div
                        key={item}
                        variants={cardReveal}
                        className="rounded-2xl border border-border/20 bg-background/80 px-4 py-3 text-sm text-foreground"
                      >
                        {item}
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            whileHover={{ y: -6 }}
          >
            <Card className="border border-border/20 bg-card/80 shadow-[0_18px_70px_-48px_rgba(31,39,90,0.35)]">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/40 text-accent-foreground">
                  <Landmark className="h-5 w-5" />
                </div>
                <CardTitle className="pt-4 text-2xl">
                  为什么这类项目更像“理性投资”
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <p className="text-base leading-8 text-muted-foreground">
                    相比单纯追求热门国家或名气标签，这条路线更强调投入产出比。它的竞争力来自于：
                    预算可控、认证明确、学习路径友好、回国使用场景清晰。
                  </p>
                </div>

                <motion.div
                  variants={cardReveal}
                  className="rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(70,86,255,0.94),rgba(110,203,255,0.76))] p-6 text-white"
                >
                  <div className="flex items-center gap-3">
                    <BriefcaseBusiness className="h-5 w-5" />
                    <p className="text-sm tracking-[0.2em] text-white/70 uppercase">
                      就业方向
                    </p>
                  </div>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mt-5 grid gap-3 sm:grid-cols-2"
                  >
                    {careerDirections.map((item) => (
                      <motion.div
                        key={item}
                        variants={cardReveal}
                        className="rounded-2xl border border-white/14 bg-white/10 px-4 py-3 text-sm text-white"
                      >
                        {item}
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-8 flex justify-center"
        >
          <AdvisorTriggerButton
            entryPoint="cost_section"
            size="lg"
            variant="outline"
            className="rounded-full border-primary/20 bg-background/90 px-6"
            question="能做学历认证吗？"
          >
            问问认证和预算是否适合我
          </AdvisorTriggerButton>
        </motion.div>
      </div>
    </section>
  )
}
