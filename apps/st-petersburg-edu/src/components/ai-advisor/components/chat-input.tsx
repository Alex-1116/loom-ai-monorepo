"use client"

import { useState, type KeyboardEvent } from "react"
import { SendHorizonal } from "lucide-react"
import { Button } from "@loom/ui/components/button"
import { Textarea } from "@loom/ui/components/textarea"

type ChatInputProps = {
  disabled?: boolean
  onSend: (message: string) => void
}

export function ChatInput({ disabled = false, onSend }: ChatInputProps) {
  const [draft, setDraft] = useState("")

  const handleSend = () => {
    const trimmed = draft.trim()

    if (!trimmed || disabled) {
      return
    }

    onSend(trimmed)
    setDraft("")
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()

      const textarea = event.currentTarget
      const { selectionStart, selectionEnd } = textarea
      const nextValue = `${draft.slice(0, selectionStart)}\n${draft.slice(
        selectionEnd
      )}`

      setDraft(nextValue)

      requestAnimationFrame(() => {
        const nextCursorPosition = selectionStart + 1
        textarea.setSelectionRange(nextCursorPosition, nextCursorPosition)
      })
      return
    }

    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="relative">
      <Textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="直接输入你最关心的问题，比如预算、认证、流程或适合度"
        className="max-h-24 min-h-16 rounded-[1.4rem] border border-input bg-background pr-14 pb-14 text-sm text-foreground shadow-[0_18px_36px_-30px_rgba(15,23,42,0.16)] placeholder:text-muted-foreground focus-visible:ring-ring/70"
      />
      <Button
        size="icon-sm"
        className="absolute right-3 bottom-3 shrink-0 rounded-full bg-[linear-gradient(135deg,rgba(68,82,255,0.98),rgba(59,130,246,0.94))] text-white shadow-[0_16px_30px_-18px_rgba(37,99,235,0.68)] hover:opacity-95"
        onClick={handleSend}
        disabled={disabled || !draft.trim()}
      >
        <SendHorizonal className="h-4 w-4" />
      </Button>
    </div>
  )
}
