"use client"

import { cn } from "@loom/ui/lib/utils"
import type { AdvisorMessage } from "@/src/components/ai-advisor/provider"

export function ChatMessageBubble({ message }: { message: AdvisorMessage }) {
  const isAssistant = message.role === "assistant"

  return (
    <div className={cn("flex", isAssistant ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[86%] rounded-[1.4rem] px-4 py-3 text-sm leading-6 shadow-sm",
          isAssistant
            ? "border border-border bg-card text-card-foreground shadow-[0_18px_34px_-24px_rgba(15,23,42,0.16)] backdrop-blur"
            : "bg-[linear-gradient(135deg,rgba(68,82,255,0.96),rgba(59,130,246,0.92),rgba(110,205,255,0.88))] text-white shadow-[0_20px_36px_-24px_rgba(37,99,235,0.55)]"
        )}
      >
        {message.content}
      </div>
    </div>
  )
}
