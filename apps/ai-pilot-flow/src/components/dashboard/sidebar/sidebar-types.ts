import { type LucideIcon } from "lucide-react"

export type SidebarNavigationChildItem = {
  title: string
  url: string
}

export type SidebarNavigationItem = {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  items?: SidebarNavigationChildItem[]
}

export type SidebarActionMenu = "project-more"

export type SidebarTrailingItem = {
  title: string
  icon: LucideIcon
}

export type SidebarNavigationGroup = {
  key: string
  label?: string
  className?: string
  itemSize?: "default" | "sm"
  actionMenu?: SidebarActionMenu
  trailingItem?: SidebarTrailingItem
  items: SidebarNavigationItem[]
}
