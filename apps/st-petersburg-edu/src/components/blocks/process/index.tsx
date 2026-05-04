"use client"

import { motion } from "framer-motion"
import { FileText, GraduationCap, Plane, ScanSearch } from "lucide-react"

import { AdvisorTriggerButton } from "@/src/components/ai-advisor"
import { SectionHeading } from "@/src/components/blocks/section-heading"

const steps = [
  {
    step: "01",
    title: "前期评估",
    description: "结合学历背景、预算区间和时间计划，判断是否适合申请该项目。",
    icon: ScanSearch,
  },
  {
    step: "02",
    title: "材料准备",
    description: "统一梳理申请材料、翻译公证与预科或专业申请节点，减少遗漏。",
    icon: FileText,
  },
  {
    step: "03",
    title: "签证与落地",
    description:
      "推进签证办理、接机安排、宿舍入住和学校注册，降低初到陌生环境的压力。",
    icon: Plane,
  },
  {
    step: "04",
    title: "入学与陪跑",
    description: "预科适应、学业跟进和后续毕业支持持续衔接，让学生节奏更稳。",
    icon: GraduationCap,
  },
]

export function Process() {
  return (
    <section id="process" className="scroll-mt-24 py-24 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeading
          badge="申请流程"
          title="把复杂留学流程，收敛成一条清晰可执行的路径"
          description="真正影响转化的，不只是学校介绍，而是用户能否看懂流程、建立信任，并敢于迈出第一步。"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative rounded-[2rem] border border-border/20 bg-card/80 p-6 shadow-[0_20px_70px_-48px_rgba(31,39,90,0.4)]"
            >
              <div className="absolute top-5 right-5 text-5xl leading-none font-semibold text-primary/10">
                {item.step}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="mt-8 flex justify-center"
        >
          <AdvisorTriggerButton
            entryPoint="process_section"
            size="lg"
            variant="outline"
            className="rounded-full border-primary/20 bg-background/90 px-6"
            question="申请流程怎么走？"
          >
            让 AI 帮我判断从哪一步开始
          </AdvisorTriggerButton>
        </motion.div>
      </div>
    </section>
  )
}
