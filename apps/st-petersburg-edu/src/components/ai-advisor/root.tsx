"use client"

import type { ReactNode } from "react"
import { AiAdvisorLauncher } from "./components/launcher"
import { AiAdvisorPanel } from "./components/chat-panel"
import { AiAdvisorProvider } from "./provider"

export function AiAdvisorRoot({ children }: { children: ReactNode }) {
  return (
    <AiAdvisorProvider>
      {children}
      <AiAdvisorLauncher />
      <AiAdvisorPanel />
    </AiAdvisorProvider>
  )
}
