import type { ReactNode } from "react"

import { Badge } from "@loom/ui/components/badge"
import { SidebarTrigger } from "@loom/ui/components/sidebar"

type PageShellProps = {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  actions?: ReactNode
}

export function PageShell({
  eyebrow,
  title,
  description,
  children,
  actions,
}: PageShellProps) {
  return (
    <div className="flex min-h-svh flex-1 flex-col">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-background/90 px-4 py-3 backdrop-blur md:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <SidebarTrigger className="mt-1" />
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {eyebrow}
            </p>
            <h1 className="truncate text-xl font-semibold md:text-2xl">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">Scaffold</Badge>
          {actions ? (
            <div className="hidden items-center gap-2 md:flex">{actions}</div>
          ) : null}
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 px-4 py-6 md:px-6">
        {children}
      </div>
    </div>
  )
}
