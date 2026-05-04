"use client"

import { ShieldCheck, Sparkles } from "lucide-react"
import { Badge } from "@loom/ui/components/badge"

export function ChatHeader() {
  return (
    <div className="flex flex-col gap-4 border-b border-border/80 bg-card/95 p-4 backdrop-blur">
      <div className="flex items-start justify-between gap-4 pr-10">
        <div className="space-y-1.5">
          <Badge className="w-fit bg-[linear-gradient(135deg,rgba(68,82,255,0.95),rgba(96,165,250,0.92))] text-white shadow-[0_14px_32px_-20px_rgba(37,99,235,0.8)]">
            <Sparkles className="h-3 w-3" />
            AI 招生咨询助手
          </Badge>
          <div className="space-y-1.5">
            <h2 className="text-base font-semibold text-foreground">
              圣彼得堡留学评估助手
            </h2>
            <p className="max-w-md text-sm leading-5 text-muted-foreground">
              先回答高频问题，再根据你的情况引导初步评估和人工顾问跟进。
            </p>
          </div>
        </div>
        <div className="hidden rounded-2xl border border-border bg-muted/70 p-3 text-primary shadow-[0_18px_40px_-28px_rgba(37,99,235,0.28)] md:block">
          <ShieldCheck className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
