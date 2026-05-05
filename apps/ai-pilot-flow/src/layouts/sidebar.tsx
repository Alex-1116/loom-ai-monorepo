"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bot,
  LayoutDashboard,
  PlayCircle,
  Settings,
  Workflow,
} from "lucide-react"

import { Badge } from "@loom/ui/components/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@loom/ui/components/sidebar"

const primaryNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Workflows",
    href: "/workflows",
    icon: Workflow,
  },
  {
    title: "Runs",
    href: "/runs",
    icon: PlayCircle,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
] as const

function isItemActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-sidebar-accent"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Bot className="size-4" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">AI Pilot Flow</span>
            <span className="truncate text-xs text-sidebar-foreground/70">
              AIGC Workflow Console
            </span>
          </div>
          <Badge
            variant="outline"
            className="group-data-[collapsible=icon]:hidden"
          >
            Alpha
          </Badge>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNavItems.map(({ title, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isItemActive(pathname, href)}
                    tooltip={title}
                  >
                    <Link href={href}>
                      <Icon />
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="rounded-xl border border-sidebar-border/70 bg-sidebar-accent/40 px-3 py-3 text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
          当前为后台空壳结构，页面与模块仅做占位。
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
