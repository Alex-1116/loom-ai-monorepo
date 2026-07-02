"use client"

import Link from "next/link"
import { type ComponentType, type SVGProps } from "react"

import { useSidebar } from "@loom/ui/components/sidebar"

type SidebarSocialItem = {
  title: string
  url: string
  target?: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

export function NavFooter({ social }: { social: SidebarSocialItem[] }) {
  const { open } = useSidebar()

  return (
    <>
      {open ? (
        <div className="mx-auto flex w-full items-center justify-center gap-x-4 border-t border-gray-200 px-4 py-4">
          {social.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={`${item.title}:${item.url}`}
                href={item.url}
                target={item.target ?? "_self"}
                rel={
                  item.target === "_blank" ? "noopener noreferrer" : undefined
                }
                className="cursor-pointer hover:text-primary"
                aria-label={item.title}
              >
                <Icon className="size-4" />
              </Link>
            )
          })}
        </div>
      ) : null}
    </>
  )
}
