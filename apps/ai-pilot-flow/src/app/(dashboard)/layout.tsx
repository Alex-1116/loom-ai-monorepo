import type { ReactNode } from "react"

import { SidebarInset, SidebarProvider } from "@loom/ui/components/sidebar"

import { AppSidebar } from "@/layouts/sidebar"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
