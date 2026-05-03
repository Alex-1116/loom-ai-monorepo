import type { LucideIcon } from "lucide-react"
import {
  BadgeDollarSign,
  BookOpenCheck,
  Building2,
  Compass,
  MapPinned,
  UsersRound,
} from "lucide-react"

type SiteNavItem = {
  href: string
  label: string
  icon: LucideIcon
}

export const siteNavItems: SiteNavItem[] = [
  { href: "#city-campus", label: "城市与校园", icon: Building2 },
  { href: "#features", label: "项目优势", icon: Compass },
  { href: "#costs", label: "费用与认证", icon: BadgeDollarSign },
  { href: "#major-service", label: "专业与保障", icon: BookOpenCheck },
  { href: "#process", label: "申请流程", icon: MapPinned },
  { href: "#audience", label: "适合人群", icon: UsersRound },
]
