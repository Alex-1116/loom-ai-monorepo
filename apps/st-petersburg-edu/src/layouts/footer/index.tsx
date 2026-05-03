"use client"

import { motion } from "framer-motion"

import { cardReveal, staggerContainer, viewportOnce } from "@/src/lib/motion"

export function SiteFooter() {
  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="border-t border-border/60 bg-background/70 py-12"
    >
      <div className="container mx-auto grid gap-8 px-4 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <motion.div variants={cardReveal}>
          <p className="text-xl font-semibold tracking-tight text-foreground">
            圣彼得堡国立交通大学留学专题站
          </p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            面向预算敏感、重视学历认证与留学回报率的学生，提供更聚焦、更务实的俄罗斯留学解决方案。
          </p>
        </motion.div>
        <motion.div
          variants={cardReveal}
          className="text-left text-sm text-muted-foreground md:text-right"
        >
          <p>开启你的俄罗斯名校之旅</p>
          <p className="mt-2">
            © {new Date().getFullYear()} Study In St. Petersburg
          </p>
        </motion.div>
      </div>
    </motion.footer>
  )
}
