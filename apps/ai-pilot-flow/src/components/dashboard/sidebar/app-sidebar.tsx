"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@loom/ui/components/sidebar"

import {
  sidebarGroups,
  sidebarUser,
  sidebarSocial,
} from "@/components/dashboard/sidebar/sidebar-data"
import { NavHeader } from "@/components/dashboard/sidebar/nav-header"
import { NavMain } from "@/components/dashboard/sidebar/nav-main"
import { NavUser } from "@/components/dashboard/sidebar/nav-user"
import { NavFooter } from "@/components/dashboard/sidebar/nav-footer"

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>

      {/* <SidebarSeparator /> */}

      <SidebarContent>
        <NavMain items={sidebarGroups} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={sidebarUser} />
        <NavFooter social={sidebarSocial} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
