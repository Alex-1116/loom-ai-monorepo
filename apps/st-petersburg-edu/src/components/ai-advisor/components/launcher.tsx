"use client"

import { MessageCircleMore, Sparkles } from "lucide-react"
import { Button } from "@loom/ui/components/button"
import { useAiAdvisor } from "@/src/components/ai-advisor/provider"

export function AiAdvisorLauncher() {
  const { openAdvisor } = useAiAdvisor()

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <div className="hidden max-w-56 rounded-2xl border border-border bg-card/92 px-4 py-3 text-sm text-muted-foreground shadow-[0_24px_80px_-40px_rgba(15,23,42,0.22)] backdrop-blur md:block">
        先问 AI 顾问，预算、认证和申请路径都可以先帮你判断。
      </div>
      <Button
        size="lg"
        className="h-13 rounded-full border border-white/30 bg-[linear-gradient(135deg,rgba(68,82,255,0.98),rgba(59,130,246,0.94),rgba(110,205,255,0.88))] px-5 text-white shadow-[0_22px_60px_-24px_rgba(37,99,235,0.6)] hover:opacity-95"
        onClick={() => openAdvisor({ entryPoint: "floating_button" })}
      >
        <Sparkles className="h-4 w-4" />
        先问 AI 顾问
        <span className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/16 bg-white/18">
          <MessageCircleMore className="h-4 w-4" />
        </span>
      </Button>
    </div>
  )
}
