"use client"

import { motion } from "framer-motion"
import { ArrowRight, MessageCircleMore } from "lucide-react"

import { AdvisorTriggerButton } from "@/src/components/ai-advisor"
import { cardReveal, staggerContainer, viewportOnce } from "@/src/lib/motion"

export function FinalCta() {
  return (
    <section className="pt-6 pb-24 md:pb-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={cardReveal}
          whileHover={{ y: -4 }}
          className="overflow-hidden rounded-[2.25rem] border border-primary/15 bg-[linear-gradient(135deg,rgba(68,82,255,0.96),rgba(110,205,255,0.78),rgba(255,197,95,0.9))] px-6 py-10 text-white shadow-[0_30px_90px_-40px_rgba(68,82,255,0.8)] sm:px-10 sm:py-14"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.p
              variants={cardReveal}
              className="text-sm font-medium tracking-[0.28em] text-white/70 uppercase"
            >
              Ready To Start
            </motion.p>
            <motion.h2
              variants={cardReveal}
              className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl"
            >
              先别急着决定国家，先拿一份适合你的留学路径建议
            </motion.h2>
            <motion.p
              variants={cardReveal}
              className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/82 sm:text-lg"
            >
              如果你在意预算、认证、毕业难度与回国使用价值，我们可以先帮你判断这条路径是否真的适合你。
            </motion.p>
            <motion.div
              variants={cardReveal}
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <AdvisorTriggerButton
                entryPoint="final_cta"
                size="lg"
                variant="secondary"
                className="h-12 rounded-full border-0 bg-white px-6 text-base text-slate-900 hover:bg-white/90"
                question="我这种情况适不适合这条路径？"
              >
                立即获取评估
                <ArrowRight className="ml-2 h-4 w-4" />
              </AdvisorTriggerButton>
              <AdvisorTriggerButton
                entryPoint="final_cta"
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/30 bg-white/8 px-6 text-base text-white hover:bg-white/12"
                question="可以直接转人工顾问吗？"
              >
                微信咨询入口
                <MessageCircleMore className="ml-2 h-4 w-4" />
              </AdvisorTriggerButton>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
