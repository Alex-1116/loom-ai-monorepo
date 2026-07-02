import type { ReactNode } from "react"

import DashboardLayout from "@/components/dashboard/layout"

export default function DashboardLayoutRoot({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return <DashboardLayout>{children}</DashboardLayout>
}
