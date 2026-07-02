"use client"

import {
  Bot,
  BookOpen,
  Frame,
  House,
  LifeBuoy,
  Github,
  Map,
  MoreHorizontal,
  PieChart,
  PlayCircle,
  Send,
  Settings,
  SquareTerminal,
  Twitter,
  Workflow,
} from "lucide-react"

import { type SidebarNavigationGroup } from "@/components/dashboard/sidebar/sidebar-types"

export const sidebarUser = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "",
}

export const sidebarSocial = [
  {
    title: "Home",
    url: "/",
    target: "_blank",
    icon: House,
  },
  {
    title: "Github",
    url: "https://github.com/Alex-1116/tarn-ai-monorepo",
    target: "_blank",
    icon: Github,
  },
  {
    title: "Facebook",
    url: "https://facebook.com",
    target: "_blank",
    icon: Send,
  },
  {
    title: "Twitter",
    url: "https://x.com",
    target: "_blank",
    icon: Twitter,
  },
]

export const sidebarGroups = [
  {
    key: "workspace",
    label: "Workspace",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: House,
      },
      {
        title: "Workflows",
        url: "/workflows",
        icon: Workflow,
      },
      {
        title: "Runs",
        url: "/runs",
        icon: PlayCircle,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
      {
        title: "Playground",
        url: "#",
        icon: SquareTerminal,
        isActive: false,
        items: [
          {
            title: "History",
            url: "#",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
    ],
  },
  {
    key: "projects",
    label: "Projects",
    className: "group-data-[collapsible=icon]:hidden",
    actionMenu: "project-more",
    trailingItem: {
      title: "More",
      icon: MoreHorizontal,
    },
    items: [
      {
        title: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        title: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        title: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  },
  {
    key: "secondary",
    className: "mt-auto",
    itemSize: "sm",
    items: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
  },
] satisfies SidebarNavigationGroup[]
