"use client"

import Image from "next/image"

import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

import { AdvisorTriggerButton } from "@/src/components/ai-advisor"
import { Button } from "@loom/ui/components/button"

const highlights = [
  "一年总预算约 5-6 万",
  "教育部认证可做留服",
  "预科住学一体更省心",
]

const metrics = [
  { value: "200+", label: "年历史积淀" },
  { value: "98.5%", label: "就业率表现" },
  { value: "80-250", label: "宿舍月费用" },
]

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  }

  return (
    <section className="relative overflow-hidden pt-6 pb-16 md:pt-10 md:pb-24">
      <div className="absolute inset-0 -z-20">
        <Image
          src="/assets/image45.jpeg"
          alt="圣彼得堡城市景观"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,18,46,0.86)_0%,rgba(14,23,56,0.72)_38%,rgba(20,34,76,0.38)_62%,rgba(20,34,76,0.18)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-[linear-gradient(180deg,transparent,rgba(246,248,255,0.98))] dark:bg-[linear-gradient(180deg,transparent,rgba(24,29,51,0.98))]" />
      <motion.div
        className="relative z-10 container mx-auto grid min-h-[calc(100svh-5rem)] gap-8 px-4 py-8 md:min-h-[calc(100svh-6rem)] md:gap-10 md:py-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-12 lg:py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-6 md:space-y-8">
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full border border-white/7 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
              圣彼得堡国立交通大学官方招生专题
            </span>
            <span className="hidden items-center rounded-full border border-[#ffd27a]/30 bg-[#ffd27a]/12 px-4 py-1.5 text-sm font-medium text-[#ffe7b7] backdrop-blur sm:inline-flex">
              预算友好 · 认证明确 · 路径清晰
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="max-w-5xl text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            用更低预算，
            <span className="block bg-gradient-to-r from-white via-[#dce5ff] to-[#ffd88c] bg-clip-text text-transparent">
              打开俄罗斯名校留学通道
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8 md:text-xl"
          >
            为预算有限、追求学历认可与落地效率的学生，提供一套更务实的留学选择。
            从申请、签证到落地入学，全流程有节奏、有结果。
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="grid gap-3 sm:grid-cols-3"
          >
            {highlights.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/8 px-4 py-3 shadow-sm backdrop-blur-md"
              >
                <CheckCircle2 className="h-5 w-5 text-[#ffd37f]" />
                <span className="text-sm font-medium text-white">{item}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <AdvisorTriggerButton
              entryPoint="hero_cta"
              size="lg"
              className="h-12 w-full rounded-full border-0 bg-white px-6 text-base text-slate-950 shadow-[0_18px_45px_-20px_rgba(72,92,255,0.75)] transition-transform hover:scale-[1.02] hover:bg-white/92 sm:w-auto"
              question="我适合申请吗？"
            >
              免费获取评估方案
              <ArrowRight className="ml-2 h-4 w-4" />
            </AdvisorTriggerButton>
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-full border-white/18 bg-white/8 px-6 text-base text-white backdrop-blur-md hover:bg-white/12 sm:w-auto"
            >
              查看申请路径
            </Button>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="relative mx-auto mt-2 flex w-full max-w-[560px] justify-center lg:mt-0 lg:justify-end"
        >
          <motion.div
            whileHover={{
              y: -8,
              rotate: -2,
              scale: 1.03,
              boxShadow: "0 26px 70px -28px rgba(23, 32, 78, 0.58)",
            }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="group absolute top-10 -left-30 z-10 hidden h-28 w-40 overflow-hidden rounded-[1.4rem] border border-white/20 shadow-2xl backdrop-blur lg:block"
          >
            <Image
              src="/assets/image12.jpeg"
              alt="圣彼得堡国立交通大学主楼"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-108"
              sizes="160px"
            />
          </motion.div>
          <motion.div
            whileHover={{
              y: -8,
              rotate: 2,
              scale: 1.03,
              boxShadow: "0 26px 70px -28px rgba(23, 32, 78, 0.58)",
            }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="group absolute right-6 -bottom-8 z-10 hidden h-24 w-36 overflow-hidden rounded-[1.3rem] border border-white/20 shadow-2xl backdrop-blur lg:block"
          >
            <Image
              src="/assets/image31.jpeg"
              alt="学生宿舍外景"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-108"
              sizes="144px"
            />
          </motion.div>
          <div className="relative w-full rounded-[2rem] border border-white/7 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.08))] p-4 shadow-[0_30px_80px_-36px_rgba(10,18,46,0.65)] backdrop-blur-2xl">
            <div className="rounded-[1.6rem] border border-white/7 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,247,255,0.84))] p-5 shadow-sm sm:p-6 dark:bg-[linear-gradient(180deg,rgba(31,37,66,0.92),rgba(24,29,52,0.92))]">
              <div className="mb-5 flex items-center justify-between sm:mb-6">
                <div>
                  <p className="text-sm font-medium text-primary">
                    Study In St. Petersburg
                  </p>
                  <p className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
                    留学决策面板
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {metrics.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border/20 bg-background/90 p-4"
                  >
                    <p className="text-2xl font-semibold text-foreground">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl bg-[linear-gradient(135deg,rgba(79,95,255,0.95),rgba(110,205,255,0.78))] p-6 text-white shadow-lg">
                <p className="text-sm tracking-[0.2em] text-white/75 uppercase">
                  Core Offer
                </p>
                <h3 className="mt-3 text-xl font-semibold sm:text-2xl">
                  低预算，也能读到被认可的海外学历
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/80">
                  聚焦高性价比、路径清晰、毕业难度友好的方案，帮助学生用更理性的方式完成留学目标。
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
