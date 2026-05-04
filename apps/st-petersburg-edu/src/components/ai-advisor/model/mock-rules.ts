import type { AdvisorMessage, FaqScenario } from "./types"

export const FAQ_SCENARIOS: FaqScenario[] = [
  {
    keywords: ["预算", "费用", "花费", "多少钱"],
    reply:
      "从当前项目资料看，这条路径更偏预算友好型，本硕阶段的学费和住宿成本都相对更容易规划。具体总费用会受申请层次、住宿选择和个人生活支出影响。如果你愿意，我可以进一步结合你的预算区间判断匹配度。",
  },
  {
    keywords: ["认证", "留服", "学历"],
    reply:
      "根据当前项目资料，这类项目的优势之一是学历认证路径相对明确，也更适合在意回国使用价值的家庭关注。不过，具体结果仍要以官方最新要求和个人实际就读情况为准。如果你更在意认证和回国用途，我可以继续帮你判断是否适合你。",
  },
  {
    keywords: ["适合", "适不适合", "匹配", "能不能申请"],
    reply:
      "这条路径通常更适合预算相对有限、重视学历认可、希望申请节奏清晰的人群。是否适合你，还需要结合你的学历背景、计划入学时间和预算一起判断。如果你愿意，我可以继续帮你做一个初步评估。",
  },
  {
    keywords: ["流程", "多久", "时间", "步骤"],
    reply:
      "整体流程一般会经过前期评估、材料准备、签证与落地、入学与后续陪跑几个阶段。你现在不需要一次性把所有细节都弄清楚，先判断自己是否适合，再按节点推进会更稳。如果你告诉我目标入学时间，我可以帮你看现在开始是否来得及。",
  },
  {
    keywords: ["材料", "准备什么", "清单"],
    reply:
      "申请通常会涉及学历背景材料、翻译公证和对应申请节点需要的文件，但不同学历阶段和申请层次会影响具体清单。如果你告诉我你现在的学历和目标层次，我可以先帮你判断大概需要准备哪些方向的材料。",
  },
  {
    keywords: ["微信", "顾问", "联系方式", "人工"],
    reply:
      "可以的，这类问题更适合由顾问结合你的背景继续跟进。我先帮你把人工沟通入口打开，你也可以先留一个基础信息，我们会按你的情况给你更具体的建议。",
    forceHandoff: true,
  },
]

export function buildFallbackReply(message: string) {
  if (message.length > 26) {
    return "这个问题更偏个案判断，我不建议直接给你一个过于绝对的结论。根据当前项目资料，我可以先说明通用部分；如果你愿意，也可以继续做一个简短评估，再转给顾问结合你的背景细化。"
  }

  return "这个问题我可以继续帮你拆开看。为了给你更贴近实际的建议，我更想先知道你的学历背景、预算区间或者计划入学时间。"
}

export function createAssistantMessage(content: string): AdvisorMessage {
  return {
    id: `assistant_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    role: "assistant",
    content,
  }
}

export function createUserMessage(content: string): AdvisorMessage {
  return {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    role: "user",
    content,
  }
}
