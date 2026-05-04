import type { LeadDraft } from "./types"

export const QUICK_QUESTIONS = [
  "一年预算多少？",
  "能做学历认证吗？",
  "我适合申请吗？",
  "申请流程怎么走？",
]

export const INITIAL_MESSAGE =
  "你好，我是圣彼得堡留学评估助手。你可以直接问我预算、认证、申请流程或适合度，我会先帮你做初步判断。"

export const EMPTY_LEAD_DRAFT: LeadDraft = {
  name: "",
  educationLevel: "",
  targetDegree: "",
  targetIntake: "",
  budgetRange: "",
  contact: "",
  focusTopic: "",
  notes: "",
}
