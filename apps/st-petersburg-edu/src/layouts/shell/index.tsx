import type { ReactNode } from "react"

import { AiAdvisorRoot } from "@/src/components/ai-advisor"
import { SiteFooter } from "@/src/layouts/footer"
import { SiteHeader } from "@/src/layouts/header"

type SiteShellProps = {
  children: ReactNode
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <AiAdvisorRoot>
      <div className="relative flex min-h-screen flex-col">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-[radial-gradient(circle_at_top,rgba(84,96,255,0.14),transparent_55%)]" />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </AiAdvisorRoot>
  )
}
