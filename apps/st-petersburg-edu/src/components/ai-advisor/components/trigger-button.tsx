"use client"

import type { ComponentProps, ReactNode } from "react"
import { Button } from "@loom/ui/components/button"
import type { AdvisorEntryPoint } from "@/src/components/ai-advisor/provider"
import { useAiAdvisor } from "@/src/components/ai-advisor/provider"

type AdvisorTriggerButtonProps = {
  entryPoint: Exclude<AdvisorEntryPoint, "floating_button">
  question?: string
  children: ReactNode
} & Omit<ComponentProps<typeof Button>, "children" | "onClick">

export function AdvisorTriggerButton({
  entryPoint,
  question,
  children,
  ...props
}: AdvisorTriggerButtonProps) {
  const { openAdvisor, startConversation } = useAiAdvisor()

  return (
    <Button
      {...props}
      onClick={() =>
        question
          ? startConversation({ entryPoint, question })
          : openAdvisor({ entryPoint })
      }
    >
      {children}
    </Button>
  )
}
