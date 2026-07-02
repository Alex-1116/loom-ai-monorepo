import Link from "next/link"
import { Bot } from "lucide-react"
import { Badge } from "@loom/ui/components/badge"

export function NavHeader() {
  return (
    <Link
      href="/"
      aria-label="AI Pilot Flow"
      className="flex items-center gap-3 rounded-xl px-3 py-2 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:p-0 hover:bg-sidebar-accent"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Bot className="size-4" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
        <span className="truncate text-sm font-medium">AI Pilot Flow</span>
        <span className="truncate text-xs text-sidebar-foreground/70">
          AIGC Workflow Console
        </span>
      </div>
      <Badge variant="outline" className="group-data-[collapsible=icon]:hidden">
        Alpha
      </Badge>
    </Link>
  )
}
