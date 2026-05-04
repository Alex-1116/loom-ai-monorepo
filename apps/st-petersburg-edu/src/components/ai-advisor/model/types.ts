export type AdvisorEntryPoint =
  | "floating_button"
  | "hero_cta"
  | "final_cta"
  | "cost_section"
  | "process_section"
  | "manual_trigger"

export type AdvisorStage = "chat" | "lead_capture" | "handoff"

export type MessageRole = "assistant" | "user"

export type AdvisorMessage = {
  id: string
  role: MessageRole
  content: string
}

export type LeadDraft = {
  name: string
  educationLevel: string
  targetDegree: string
  targetIntake: string
  budgetRange: string
  contact: string
  focusTopic: string
  notes: string
}

export type OpenAdvisorOptions = {
  entryPoint?: AdvisorEntryPoint
}

export type StartConversationOptions = {
  entryPoint?: AdvisorEntryPoint
  question: string
}

export type AiAdvisorContextValue = {
  isOpen: boolean
  isTyping: boolean
  entryPoint: AdvisorEntryPoint
  advisorStage: AdvisorStage
  messages: AdvisorMessage[]
  quickQuestions: string[]
  openAdvisor: (options?: OpenAdvisorOptions) => void
  closeAdvisor: () => void
  startConversation: (options: StartConversationOptions) => void
  sendMessage: (message: string) => void
  showLeadForm: () => void
  hideLeadForm: () => void
  requestHandoff: () => void
  submitLead: (lead: LeadDraft) => void
}

export type FaqScenario = {
  keywords: string[]
  reply: string
  forceHandoff?: boolean
}
