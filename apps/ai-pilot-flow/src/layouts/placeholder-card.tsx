import type { ReactNode } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@loom/ui/components/card"

type PlaceholderCardProps = {
  title: string
  description: string
  children?: ReactNode
}

export function PlaceholderCard({
  title,
  description,
  children,
}: PlaceholderCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
