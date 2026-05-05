import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Geist, Geist_Mono } from "next/font/google"

import "@loom/ui/globals.css"
import { TooltipProvider } from "@loom/ui/components/tooltip"
import { ThemeProvider } from "@/components/basics/theme/theme-provider"
import { cn } from "@loom/ui/lib/utils"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "AI Pilot Flow",
  description: "AIGC workflow project scaffold.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, fontMono.variable)}
    >
      <body className="min-h-svh bg-background text-foreground">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
