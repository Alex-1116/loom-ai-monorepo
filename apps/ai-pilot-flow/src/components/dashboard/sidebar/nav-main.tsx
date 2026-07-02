"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronRight,
  Folder,
  MoreHorizontal,
  Share,
  Trash2,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@loom/ui/components/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@loom/ui/components/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@loom/ui/components/sidebar"
import {
  type SidebarNavigationChildItem,
  type SidebarNavigationGroup,
  type SidebarNavigationItem,
} from "@/components/dashboard/sidebar/sidebar-types"

function isItemActive(pathname: string, href: string) {
  if (href === "#" || href.length === 0) {
    return false
  }

  if (href === "/") {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function getNavigationItemKey(item: { title: string; url: string }) {
  return `${item.title}:${item.url}`
}

function renderMenuButton(
  item: SidebarNavigationItem,
  itemSize: SidebarNavigationGroup["itemSize"],
  isActive: boolean,
  showTooltip: boolean
) {
  return (
    <SidebarMenuButton
      asChild
      tooltip={showTooltip ? item.title : undefined}
      size={itemSize}
      isActive={isActive}
    >
      <Link href={item.url}>
        <item.icon />
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  )
}

function renderProjectActionMenu(isMobile: boolean) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction showOnHover>
          <MoreHorizontal />
          <span className="sr-only">More</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48"
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
        <DropdownMenuItem>
          <Folder className="text-muted-foreground" />
          <span>View Project</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Share className="text-muted-foreground" />
          <span>Share Project</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Trash2 className="text-muted-foreground" />
          <span>Delete Project</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function renderSubItems(pathname: string, items: SidebarNavigationChildItem[]) {
  return (
    <SidebarMenuSub>
      {items.map((subItem) => (
        <SidebarMenuSubItem key={getNavigationItemKey(subItem)}>
          <SidebarMenuSubButton
            asChild
            isActive={isItemActive(pathname, subItem.url)}
          >
            <Link href={subItem.url}>
              <span>{subItem.title}</span>
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  )
}

function renderPlainItem(
  item: SidebarNavigationItem,
  group: SidebarNavigationGroup,
  isActive: boolean,
  isMobile: boolean
) {
  return (
    <SidebarMenuItem key={getNavigationItemKey(item)}>
      {renderMenuButton(item, group.itemSize, isActive, false)}
      {group.actionMenu === "project-more"
        ? renderProjectActionMenu(isMobile)
        : null}
    </SidebarMenuItem>
  )
}

function renderCollapsibleItem(
  item: SidebarNavigationItem,
  pathname: string,
  group: SidebarNavigationGroup,
  isActive: boolean,
  defaultOpen: boolean
) {
  if (!item.items?.length) {
    return null
  }

  return (
    <Collapsible
      key={getNavigationItemKey(item)}
      asChild
      defaultOpen={defaultOpen}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            size={group.itemSize}
            isActive={isActive}
          >
            <item.icon />
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {renderSubItems(pathname, item.items)}
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

function renderTrailingItem(group: SidebarNavigationGroup) {
  if (!group.trailingItem) {
    return null
  }

  return (
    <SidebarMenuItem key={`${group.key}-trailing`}>
      <SidebarMenuButton size={group.itemSize}>
        <group.trailingItem.icon />
        <span>{group.trailingItem.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function renderGroupMenu(
  group: SidebarNavigationGroup,
  pathname: string,
  isMobile: boolean
) {
  return (
    <SidebarMenu>
      {group.items.map((item) => {
        const hasChildren = Boolean(item.items?.length)
        const hasActiveChild =
          item.items?.some((subItem) => isItemActive(pathname, subItem.url)) ??
          false
        const isActive = isItemActive(pathname, item.url) || hasActiveChild
        const defaultOpen = item.isActive || hasActiveChild

        return hasChildren
          ? renderCollapsibleItem(item, pathname, group, isActive, defaultOpen)
          : renderPlainItem(item, group, isActive, isMobile)
      })}
      {renderTrailingItem(group)}
    </SidebarMenu>
  )
}

export function NavMain({ items }: { items: SidebarNavigationGroup[] }) {
  const pathname = usePathname()
  const { isMobile } = useSidebar()

  return (
    <>
      {items.map((group) => {
        const menu = renderGroupMenu(group, pathname, isMobile)

        return (
          <SidebarGroup key={group.key} className={group.className}>
            {group.label ? (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            ) : null}
            {group.itemSize === "sm" ? (
              <SidebarGroupContent>{menu}</SidebarGroupContent>
            ) : (
              menu
            )}
          </SidebarGroup>
        )
      })}
    </>
  )
}
