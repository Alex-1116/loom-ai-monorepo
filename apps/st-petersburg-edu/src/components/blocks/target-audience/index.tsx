"use client"

import { CheckCircle2, FileCheck2, Plane, Shield, Users } from "lucide-react"
import { motion } from "framer-motion"

import { SectionHeading } from "@/src/components/blocks/section-heading"

const profiles = [
  "预算有限，但不想随便读一所没有辨识度的学校",
  "希望学历认证明确，未来回国使用更安心",
  "不想走高压硬核工科路线，更偏向好适应、好完成",
  "第一次出国，想把签证、落地和入学流程交给熟悉的人处理",
]

const services = [
  {
    title: "申请规划",
    description: "梳理学历背景、目标专业和时间线，明确哪些路径最适合你。",
    icon: FileCheck2,
  },
  {
    title: "签证与材料",
    description: "把材料准备、翻译、公证和签证节奏收敛到一套统一流程中。",
    icon: Shield,
  },
  {
    title: "落地与注册",
    description: "接机、宿舍入住、入学注册与基础生活适应，不让学生一个人摸索。",
    icon: Plane,
  },
  {
    title: "后续陪跑",
    description: "学习适应、论文节点与毕业准备持续跟进，降低中途失速风险。",
    icon: Users,
  },
]

export function TargetAudience() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  }

  return (
    <section id="audience" className="scroll-mt-24 py-24 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            badge="适合人群与服务"
            title="如果你想要的是稳、准、省，这个方案会更匹配"
            description="网站不只是介绍学校，也要把用户最关心的匹配问题说清楚：你是否适合、我们具体怎么帮。"
            align="left"
          />
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.55 }}
            className="overflow-hidden rounded-[2rem] border border-border/20 bg-card/80 shadow-[0_22px_80px_-45px_rgba(31,39,90,0.35)]"
          >
            <div className="border-b border-border/20 bg-[linear-gradient(135deg,rgba(87,100,255,0.12),rgba(255,204,103,0.12))] p-5 sm:p-8">
              <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                你大概率适合这条路径
              </h3>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                比起盲目追求热门国家和高成本路线，你更重视性价比、学历回报和落地效率。
              </p>
            </div>
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-5 p-5 sm:p-8"
            >
              {profiles.map((item) => (
                <motion.li
                  key={item}
                  variants={itemVariants}
                  className="flex gap-4"
                >
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-base leading-7 text-foreground">{item}</p>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="rounded-[2rem] border border-border/20 bg-card/80 p-5 shadow-[0_22px_80px_-45px_rgba(31,39,90,0.35)] sm:p-8"
          >
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              我们具体提供什么
            </h3>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              从申请前评估到入学后适应，帮学生把风险点拆小、把复杂流程变简单。
            </p>
            <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2">
              {services.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-border/20 bg-background/80 p-4 transition-transform hover:-translate-y-1 sm:p-5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-foreground">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
