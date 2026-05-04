"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

import {
  EMPTY_LEAD_DRAFT,
  INITIAL_MESSAGE,
  QUICK_QUESTIONS,
} from "./model/constants"
import {
  buildFallbackReply,
  createAssistantMessage,
  createUserMessage,
  FAQ_SCENARIOS,
} from "./model/mock-rules"
import type {
  AdvisorMessage,
  AiAdvisorContextValue,
  AdvisorEntryPoint,
  AdvisorStage,
  LeadDraft,
  OpenAdvisorOptions,
  StartConversationOptions,
} from "./model/types"

export type {
  AdvisorMessage,
  AiAdvisorContextValue,
  AdvisorEntryPoint,
  AdvisorStage,
  LeadDraft,
  OpenAdvisorOptions,
  StartConversationOptions,
} from "./model/types"

const AiAdvisorContext = createContext<AiAdvisorContextValue | null>(null)

function createInitialMessages() {
  return [createAssistantMessage(INITIAL_MESSAGE)]
}

export function AiAdvisorProvider({ children }: { children: ReactNode }) {
  const timeoutRef = useRef<number | null>(null)
  const messagesRef = useRef<AdvisorMessage[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [entryPoint, setEntryPoint] =
    useState<AdvisorEntryPoint>("floating_button")
  const [advisorStage, setAdvisorStage] = useState<AdvisorStage>("chat")
  const [hasSubmittedLead, setHasSubmittedLead] = useState(false)
  const [messages, setMessages] = useState<AdvisorMessage[]>(
    createInitialMessages
  )

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const clearPendingReply = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const resetSession = useCallback(() => {
    clearPendingReply()
    setIsTyping(false)
    setAdvisorStage("chat")
    setHasSubmittedLead(false)
    setMessages(createInitialMessages())
  }, [clearPendingReply])

  const showLeadForm = useCallback(() => {
    setAdvisorStage("lead_capture")
  }, [])

  const hideLeadForm = useCallback(() => {
    setAdvisorStage("chat")
  }, [])

  const requestHandoff = useCallback(() => {
    setAdvisorStage("handoff")
  }, [])

  const closeAdvisor = useCallback(() => {
    setIsOpen(false)
    resetSession()
  }, [resetSession])

  const sendMessage = useCallback(
    (message: string) => {
      const trimmed = message.trim()

      if (!trimmed) {
        return
      }

      clearPendingReply()
      setMessages((current) => [...current, createUserMessage(trimmed)])
      setIsTyping(true)

      timeoutRef.current = window.setTimeout(() => {
        const scenario = FAQ_SCENARIOS.find(({ keywords }) =>
          keywords.some((keyword) => trimmed.includes(keyword))
        )

        const reply = scenario?.reply ?? buildFallbackReply(trimmed)
        const userSignalCount = messagesRef.current.filter(
          (item) => item.role === "user"
        ).length
        const shouldOpenLead =
          !hasSubmittedLead &&
          (userSignalCount >= 2 ||
            /预算|认证|适合|材料|申请|入学|时间|本科|大专|硕士/.test(trimmed))

        setMessages((current) => [...current, createAssistantMessage(reply)])
        setIsTyping(false)

        if (scenario?.forceHandoff) {
          setAdvisorStage("handoff")
          return
        }

        if (shouldOpenLead) {
          setAdvisorStage("lead_capture")
        }
      }, 700)
    },
    [clearPendingReply, hasSubmittedLead]
  )

  const submitLead = useCallback((lead: LeadDraft) => {
    setHasSubmittedLead(true)
    setAdvisorStage("handoff")

    const summary = `已收到你的信息：${lead.name || "同学"}，${lead.educationLevel || "待确认学历"}，目标${lead.targetDegree || "待确认层次"}，计划${lead.targetIntake || "待确认时间"}入学。接下来建议你直接和顾问沟通，我们会围绕${lead.focusTopic || "预算与适配度"}给你更具体的建议。`

    setMessages((current) => [...current, createAssistantMessage(summary)])
  }, [])

  const openAdvisor = useCallback((options?: OpenAdvisorOptions) => {
    setIsOpen(true)

    if (options?.entryPoint) {
      setEntryPoint(options.entryPoint)
    }
  }, [])

  const startConversation = useCallback(
    (options: StartConversationOptions) => {
      openAdvisor({ entryPoint: options.entryPoint })
      sendMessage(options.question)
    },
    [openAdvisor, sendMessage]
  )

  const value = useMemo(
    () => ({
      isOpen,
      isTyping,
      entryPoint,
      advisorStage,
      messages,
      quickQuestions: QUICK_QUESTIONS,
      openAdvisor,
      closeAdvisor,
      startConversation,
      sendMessage,
      showLeadForm,
      hideLeadForm,
      requestHandoff,
      submitLead,
    }),
    [
      closeAdvisor,
      entryPoint,
      hideLeadForm,
      isOpen,
      isTyping,
      messages,
      openAdvisor,
      requestHandoff,
      sendMessage,
      showLeadForm,
      advisorStage,
      startConversation,
      submitLead,
    ]
  )

  return (
    <AiAdvisorContext.Provider value={value}>
      {children}
    </AiAdvisorContext.Provider>
  )
}

export function useAiAdvisor() {
  const context = useContext(AiAdvisorContext)

  if (!context) {
    throw new Error("useAiAdvisor must be used within AiAdvisorProvider")
  }

  return context
}

export function createEmptyLeadDraft() {
  return { ...EMPTY_LEAD_DRAFT }
}
