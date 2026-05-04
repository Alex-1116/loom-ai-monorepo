"use client"

import { useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LoaderCircle, X } from "lucide-react"
import { Button } from "@loom/ui/components/button"
import { useIsMobile } from "@loom/ui/hooks/use-mobile"
import {
  SheetDescription,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@loom/ui/components/sheet"
import { cn } from "@loom/ui/lib/utils"
import { useAiAdvisor } from "@/src/components/ai-advisor/provider"
import { ChatHeader } from "./chat-header"
import { ChatInput } from "./chat-input"
import { ChatMessageBubble } from "./chat-message-bubble"
import { HandoffCard } from "./handoff-card"
import { LeadCaptureForm } from "./lead-capture-form"
import { QuickQuestions } from "./quick-questions"

type ChatPanelBodyProps = {
  hideLeadForm: () => void
  isTyping: boolean
  requestHandoff: () => void
  sendMessage: (message: string) => void
  showLeadForm: () => void
}

function ChatPanelBody({
  hideLeadForm,
  isTyping,
  requestHandoff,
  sendMessage,
  showLeadForm,
}: ChatPanelBodyProps) {
  const { messages, quickQuestions, advisorStage } = useAiAdvisor()
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const leadFormVisible = advisorStage === "lead_capture"
  const handoffVisible = advisorStage === "handoff"

  useEffect(() => {
    const scrollArea = scrollAreaRef.current

    if (!scrollArea) {
      return
    }

    scrollArea.scrollTo({
      top: scrollArea.scrollHeight,
      behavior: "smooth",
    })
  }, [handoffVisible, isTyping, leadFormVisible, messages])

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden overscroll-none">
      <QuickQuestions questions={quickQuestions} onSelect={sendMessage} />

      <div
        ref={scrollAreaRef}
        className="flex-1 space-y-4 overflow-y-auto overscroll-contain bg-background/70 px-4 py-4"
      >
        {messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}

        {isTyping ? (
          <div className="w-fit rounded-full border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-[0_16px_30px_-24px_rgba(15,23,42,0.16)] backdrop-blur">
            <div className="flex items-center gap-2">
              <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
              正在整理回复...
            </div>
          </div>
        ) : null}

        {leadFormVisible ? <LeadCaptureForm /> : null}
        {handoffVisible ? <HandoffCard /> : null}
      </div>

      <div className="space-y-4 border-t border-border/80 bg-card/95 p-4">
        <div className="flex flex-wrap gap-2">
          <Button
            size="xs"
            variant="outline"
            className="border-border bg-background text-foreground hover:bg-muted hover:text-primary"
            onClick={showLeadForm}
          >
            获取免费评估
          </Button>
          <Button
            size="xs"
            variant="outline"
            className="border-border bg-background text-foreground hover:bg-muted hover:text-primary"
            onClick={requestHandoff}
          >
            转人工顾问
          </Button>
          {leadFormVisible ? (
            <Button
              size="xs"
              variant="ghost"
              className="text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={hideLeadForm}
            >
              收起表单
            </Button>
          ) : null}
        </div>

        <ChatInput disabled={isTyping} onSend={sendMessage} />
      </div>
    </div>
  )
}

function DesktopChatPanel({
  hideLeadForm,
  isOpen,
  isTyping,
  onClose,
  requestHandoff,
  sendMessage,
  showLeadForm,
}: ChatPanelBodyProps & {
  isOpen: boolean
  onClose: () => void
}) {
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        panelRef.current &&
        event.target instanceof Node &&
        !panelRef.current.contains(event.target)
      ) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handlePointerDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handlePointerDown)
    }
  }, [isOpen, onClose])

  return (
    <div className="pointer-events-none fixed inset-0 z-50 hidden md:block">
      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.div
              className="pointer-events-auto absolute inset-0 bg-black/10 backdrop-blur-[1.5px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            />
            <motion.div
              ref={panelRef}
              className={cn(
                "pointer-events-auto absolute right-6 bottom-24 flex w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card/96 shadow-[0_30px_90px_-36px_rgba(15,23,42,0.28)] ring-1 ring-border/60",
                "max-h-[min(720px,calc(100vh-7rem))]"
              )}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.985 }}
              transition={{
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformOrigin: "bottom right" }}
            >
              <div className="relative flex min-h-0 flex-1 flex-col">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="absolute top-4 right-4 z-10 rounded-full bg-background/90 text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
                <ChatHeader />
                <ChatPanelBody
                  hideLeadForm={hideLeadForm}
                  isTyping={isTyping}
                  requestHandoff={requestHandoff}
                  sendMessage={sendMessage}
                  showLeadForm={showLeadForm}
                />
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function MobileChatPanel({
  closeAdvisor,
  hideLeadForm,
  isOpen,
  isTyping,
  openAdvisor,
  requestHandoff,
  sendMessage,
  showLeadForm,
}: ChatPanelBodyProps & {
  closeAdvisor: () => void
  isOpen: boolean
  openAdvisor: () => void
}) {
  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => (open ? openAdvisor() : closeAdvisor())}
    >
      <SheetContent
        side="right"
        className="w-full max-w-full border-l border-border bg-card p-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>圣彼得堡留学评估助手</SheetTitle>
          <SheetDescription>
            回答预算、认证、申请流程和适合度问题，并引导用户完成初步评估。
          </SheetDescription>
        </SheetHeader>
        <ChatHeader />
        <ChatPanelBody
          hideLeadForm={hideLeadForm}
          isTyping={isTyping}
          requestHandoff={requestHandoff}
          sendMessage={sendMessage}
          showLeadForm={showLeadForm}
        />
      </SheetContent>
    </Sheet>
  )
}

export function AiAdvisorPanel() {
  const {
    closeAdvisor,
    hideLeadForm,
    isOpen,
    isTyping,
    openAdvisor,
    requestHandoff,
    sendMessage,
    showLeadForm,
  } = useAiAdvisor()
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <MobileChatPanel
        closeAdvisor={closeAdvisor}
        hideLeadForm={hideLeadForm}
        isOpen={isOpen}
        isTyping={isTyping}
        openAdvisor={openAdvisor}
        requestHandoff={requestHandoff}
        sendMessage={sendMessage}
        showLeadForm={showLeadForm}
      />
    )
  }

  return (
    <DesktopChatPanel
      hideLeadForm={hideLeadForm}
      isOpen={isOpen}
      isTyping={isTyping}
      onClose={closeAdvisor}
      requestHandoff={requestHandoff}
      sendMessage={sendMessage}
      showLeadForm={showLeadForm}
    />
  )
}
