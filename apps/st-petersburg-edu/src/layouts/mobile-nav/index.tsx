"use client"

import { Menu } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@loom/ui/components/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@loom/ui/components/sheet"
import { cardReveal, staggerContainer, viewportOnce } from "@/src/lib/motion"
import { siteNavItems } from "@/src/lib/site-nav"

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-border/60 bg-background/70 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">打开导航菜单</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[86vw] max-w-sm border-border/60 bg-background/95 px-0"
      >
        <SheetHeader className="border-b border-border/60 px-6 pb-5">
          <SheetTitle>页面导航</SheetTitle>
          <SheetDescription>快速跳转到你关心的内容模块</SheetDescription>
        </SheetHeader>
        <motion.nav
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          viewport={viewportOnce}
          className="flex flex-col p-4"
        >
          {siteNavItems.map((item) => {
            const Icon = item.icon

            return (
              <SheetClose asChild key={item.href}>
                <motion.a
                  variants={cardReveal}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  whileHover={{ x: 4 }}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{item.label}</span>
                </motion.a>
              </SheetClose>
            )
          })}
        </motion.nav>
      </SheetContent>
    </Sheet>
  )
}
