import type { ReactNode } from "react"

import { SidebarInset, SidebarProvider } from "@loom/ui/components/sidebar"

import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar"
import { AppHeader } from "@/components/dashboard/header/app-header"

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
          // '--header-height': 'calc(var(--spacing) * 12)',
          // '--sidebar-width-icon': "3.5rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
