"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@loom/ui/components/breadcrumb"
import { Separator } from "@loom/ui/components/separator"
import { SidebarTrigger } from "@loom/ui/components/sidebar"
import { sidebarGroups } from "@/components/dashboard/sidebar/sidebar-data"
import { type SidebarNavigationGroup } from "@/components/dashboard/sidebar/sidebar-types"

type BreadcrumbEntry = {
  href: string
  title: string
}

function buildRouteTitleMap() {
  const routeTitleMap: Record<string, string> = {}
  const navigationGroups: SidebarNavigationGroup[] = sidebarGroups

  navigationGroups.forEach((group) => {
    group.items.forEach((item) => {
      if (item.url && item.url !== "#") {
        routeTitleMap[item.url] = item.title
      }

      item.items?.forEach((subItem) => {
        if (subItem.url && subItem.url !== "#") {
          routeTitleMap[subItem.url] = subItem.title
        }
      })
    })
  })

  return routeTitleMap
}

const breadcrumbTitleMap = buildRouteTitleMap()

function formatBreadcrumbTitle(segment: string) {
  return segment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function buildBreadcrumbs(pathname: string): BreadcrumbEntry[] {
  const normalizedPath = pathname === "" ? "/" : pathname
  const rootEntry = {
    href: "/",
    title: breadcrumbTitleMap["/"] ?? "Dashboard",
  }

  if (normalizedPath === "/") {
    return [rootEntry]
  }

  const segments = normalizedPath.split("/").filter(Boolean)

  return [
    rootEntry,
    ...segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`

      return {
        href,
        title: breadcrumbTitleMap[href] ?? formatBreadcrumbTitle(segment),
      }
    }),
  ]
}

export function AppHeader() {
  const pathname = usePathname()
  const breadcrumbs = buildBreadcrumbs(pathname)

  return (
    <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border py-3 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex w-full min-w-0 items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        {breadcrumbs.length > 0 ? (
          <>
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((item, index) => {
                  const isLast = index === breadcrumbs.length - 1

                  return (
                    <Fragment key={item.href}>
                      <BreadcrumbItem
                        className={isLast ? undefined : "hidden md:block"}
                      >
                        {isLast ? (
                          <BreadcrumbPage>{item.title}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={item.href}>{item.title}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast ? (
                        <BreadcrumbSeparator className="hidden md:block" />
                      ) : null}
                    </Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </>
        ) : null}
      </div>
    </header>
  )
}
