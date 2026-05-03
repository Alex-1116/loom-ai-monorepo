"use client"

import { motion } from "framer-motion"

import { MobileNav } from "@/src/layouts/mobile-nav"
import { ThemeToggle } from "@/src/components/basics/theme/theme-toggle"
import { cardReveal, staggerContainer } from "@/src/lib/motion"
import { siteNavItems } from "@/src/lib/site-nav"

export function SiteHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <motion.div whileHover={{ y: -1 }} className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: -6, scale: 1.04 }}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(88,102,255,0.95),rgba(255,196,90,0.9))] text-sm font-semibold text-white shadow-lg"
          >
            SP
          </motion.div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
              Study In Russia
            </p>
            <p className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-base">
              圣彼得堡国立交通大学
            </p>
          </div>
        </motion.div>

        <nav className="flex items-center gap-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="hidden gap-2 text-sm font-medium text-muted-foreground lg:flex"
          >
            {siteNavItems.map((item) => {
              const Icon = item.icon

              return (
                <motion.a
                  key={item.href}
                  variants={cardReveal}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-muted/70 hover:text-foreground"
                  whileHover={{ y: -2 }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </motion.a>
              )
            })}
          </motion.div>
          <MobileNav />
          <ThemeToggle />
        </nav>
      </div>
    </motion.header>
  )
}
