"use client"

import { CheckCircle2, MessageCircleMore } from "lucide-react"
import { Badge } from "@loom/ui/components/badge"
import { Button } from "@loom/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@loom/ui/components/card"

export function HandoffCard() {
  return (
    <Card className="border border-border/20 bg-card py-5 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.16)]">
      <CardHeader className="gap-3">
        <Badge className="w-fit bg-[linear-gradient(135deg,rgba(5,150,105,0.98),rgba(16,185,129,0.92))] text-white">
          人工接管已就绪
        </Badge>
        <CardTitle className="text-lg text-card-foreground">
          下一步建议直接转顾问
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          我们已经整理好你的咨询方向，接下来更适合由顾问继续跟进细节。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-[1.25rem] border border-border bg-muted/35 p-4 text-sm leading-7 text-muted-foreground">
          你可以直接添加顾问微信，或留下联系方式安排回拨。涉及申请时间、材料清单、预算匹配度这类个案问题，顾问会更高效。
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            size="lg"
            className="w-full bg-[linear-gradient(135deg,rgba(5,150,105,0.98),rgba(16,185,129,0.92))] text-white shadow-[0_18px_32px_-24px_rgba(16,185,129,0.45)] hover:opacity-95"
          >
            添加微信顾问
            <MessageCircleMore className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full border-border bg-background text-foreground hover:bg-muted hover:text-foreground"
          >
            安排顾问回拨
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
