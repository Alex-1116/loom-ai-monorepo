# st-petersburg-edu AI 招生助手 API 设计文档

## 1. 设计目标

本文件用于定义 `st-petersburg-edu` 项目 AI 招生咨询助手第一版接口设计，服务于以下能力：

- AI 对话
- 会话管理
- 留资表单提交
- 人工接管
- FAQ 与快捷问题下发
- 埋点事件采集

设计目标：

- 优先满足 MVP 上线
- 保持接口简单稳定
- 方便后续扩展到其他教育项目
- 保持前端、模型层、数据层解耦

## 2. 设计原则

- 所有接口返回统一结构
- 错误信息对前端友好
- 支持会话追踪
- 支持来源页面和入口标记
- 支持后续接入更多渠道

## 3. 基础约定

### 3.1 路由前缀

推荐使用当前应用内 API 路由：

```text
/app/api/*
```

建议首版接口：

- `POST /api/ai/chat`
- `POST /api/leads`
- `POST /api/handoff`
- `GET /api/faq`
- `POST /api/events`

### 3.2 响应结构

所有接口统一返回以下结构：

```json
{
  "success": true,
  "message": "ok",
  "data": {}
}
```

错误结构：

```json
{
  "success": false,
  "message": "参数错误",
  "error_code": "INVALID_PARAMS"
}
```

### 3.3 通用字段

所有请求尽量带上以下上下文字段：

- `project_code`
- `session_id`
- `visitor_id`
- `source_page`
- `entry_point`
- `timestamp`

推荐固定值：

```text
project_code = st-petersburg-edu
```

## 4. 会话模型

### 4.1 session_id

用于标识一次持续聊天会话。

建议规则：

- 前端首次打开聊天面板时生成
- 保存在 `localStorage`
- 同一访客在有效期内复用同一个 `session_id`

### 4.2 visitor_id

用于标识匿名访客。

建议规则：

- 首次进入页面时生成
- 长期保存在本地
- 用于统计跨会话行为

### 4.3 entry_point

用于分析用户从哪个入口开始聊天。

可选值建议：

- `floating_button`
- `hero_cta`
- `final_cta`
- `cost_section`
- `process_section`
- `manual_trigger`

## 5. AI 聊天接口

### 5.1 接口说明

```text
POST /api/ai/chat
```

用途：

- 接收用户消息
- 查询知识内容
- 调用模型生成回复
- 返回推荐动作，如显示表单或转人工

### 5.2 请求参数

```json
{
  "project_code": "st-petersburg-edu",
  "session_id": "sess_xxx",
  "visitor_id": "visitor_xxx",
  "source_page": "/",
  "entry_point": "floating_button",
  "message": "这个学历能做认证吗？",
  "history": [
    {
      "role": "assistant",
      "content": "你好，我是圣彼得堡留学评估助手。"
    },
    {
      "role": "user",
      "content": "一年预算大概多少？"
    }
  ],
  "context": {
    "lead_status": "not_submitted",
    "intent_level": "unknown"
  }
}
```

### 5.3 字段说明

- `message`：用户最新输入
- `history`：最近若干轮对话，可限制为 10 到 20 条
- `context.lead_status`：是否已留资
- `context.intent_level`：当前已识别意向等级

### 5.4 响应结构

```json
{
  "success": true,
  "message": "ok",
  "data": {
    "reply": "根据当前项目资料，这类项目更强调认证路径相对明确，但具体仍需以官方最新要求和个人实际情况为准。如果你愿意，我可以先帮你做一个初步评估。",
    "session_id": "sess_xxx",
    "intent_level": "medium",
    "answer_type": "faq",
    "actions": {
      "show_lead_form": true,
      "show_handoff": false,
      "show_wechat": false,
      "recommended_questions": ["我适合申请吗？", "申请流程怎么走？"]
    },
    "meta": {
      "matched_faq_id": "faq_02",
      "risk_level": "medium"
    }
  }
}
```

### 5.5 响应字段说明

- `reply`：AI 返回文本
- `intent_level`：本轮识别出的用户意向等级
- `answer_type`：如 `faq`、`generated`、`fallback`
- `actions.show_lead_form`：是否建议前端展示留资表单
- `actions.show_handoff`：是否建议前端展示人工接管入口
- `actions.show_wechat`：是否建议展示微信卡片
- `recommended_questions`：下一步推荐问题

### 5.6 后端处理流程

建议后端执行以下步骤：

1. 校验请求参数
2. 写入用户消息
3. 召回 FAQ 或知识片段
4. 识别意图和意向等级
5. 拼接系统提示词和上下文
6. 调用大模型生成回答
7. 根据规则生成推荐动作
8. 写入 AI 回答
9. 返回响应

### 5.7 规则建议

建议以下场景返回 `show_lead_form = true`：

- 用户连续提问 2 次以上
- 用户询问预算、认证、适合度
- 用户主动暴露学历或计划时间

建议以下场景返回 `show_handoff = true`：

- 用户明确要联系方式
- 用户询问复杂个案问题
- 用户对结果表示强兴趣
- 模型命中风险边界

## 6. 留资接口

### 6.1 接口说明

```text
POST /api/leads
```

用途：

- 提交评估表单
- 存储线索
- 标记会话进入待跟进状态
- 触发顾问通知

### 6.2 请求参数

```json
{
  "project_code": "st-petersburg-edu",
  "session_id": "sess_xxx",
  "visitor_id": "visitor_xxx",
  "source_page": "/",
  "entry_point": "floating_button",
  "lead": {
    "name": "张同学",
    "education_level": "本科",
    "target_degree": "硕士",
    "target_intake": "2026 秋季",
    "budget_range": "5 到 8 万",
    "contact": "13800000000",
    "focus_topics": ["认证", "预算"],
    "accepts_foundation": "unknown",
    "current_city": "杭州",
    "wants_contact": true
  }
}
```

### 6.3 参数校验建议

首版必填：

- `session_id`
- `lead.name`
- `lead.education_level`
- `lead.target_degree`
- `lead.target_intake`
- `lead.budget_range`
- `lead.contact`

### 6.4 响应结构

```json
{
  "success": true,
  "message": "lead_created",
  "data": {
    "lead_id": "lead_xxx",
    "follow_up_status": "pending",
    "wechat_exposed": true,
    "next_action": "handoff"
  }
}
```

### 6.5 后端动作

提交成功后建议执行：

1. 写入线索表
2. 更新会话状态为 `lead_submitted`
3. 记录埋点 `lead_form_submitted`
4. 触发通知给顾问
5. 返回微信卡片展示信号

## 7. 人工接管接口

### 7.1 接口说明

```text
POST /api/handoff
```

用途：

- 记录用户主动转人工行为
- 为顾问分配待接管线索
- 返回接管后的展示信息

### 7.2 请求参数

```json
{
  "project_code": "st-petersburg-edu",
  "session_id": "sess_xxx",
  "visitor_id": "visitor_xxx",
  "handoff_type": "wechat",
  "reason": "user_requested_contact"
}
```

### 7.3 参数说明

`handoff_type` 可选值建议：

- `wechat`
- `manual_callback`
- `crm_queue`

`reason` 可选值建议：

- `user_requested_contact`
- `complex_question`
- `strong_intent`
- `ai_fallback`

### 7.4 响应结构

```json
{
  "success": true,
  "message": "handoff_created",
  "data": {
    "handoff_id": "handoff_xxx",
    "handoff_type": "wechat",
    "display": {
      "title": "已为你转接顾问",
      "description": "你可以直接添加微信继续沟通，我们也会根据你的信息尽快跟进。",
      "wechat_qr_url": "/wechat/consultant-qr.png"
    }
  }
}
```

## 8. FAQ 接口

### 8.1 接口说明

```text
GET /api/faq
```

用途：

- 下发快捷问题
- 下发首批 FAQ
- 为前端展示推荐问题提供数据

### 8.2 请求参数

查询参数建议：

- `project_code`
- `scene`

示例：

```text
/api/faq?project_code=st-petersburg-edu&scene=chat_home
```

### 8.3 响应结构

```json
{
  "success": true,
  "message": "ok",
  "data": {
    "quick_questions": [
      "一年预算多少？",
      "能做学历认证吗？",
      "我适合申请吗？",
      "申请流程怎么走？"
    ],
    "faq_items": [
      {
        "id": "faq_01",
        "question": "一年总费用大概多少？",
        "answer": "根据当前项目资料，这条路径整体预算相对友好......",
        "cta_type": "lead_form"
      }
    ]
  }
}
```

## 9. 埋点事件接口

### 9.1 接口说明

```text
POST /api/events
```

用途：

- 采集 AI 招生助手相关行为事件
- 支持后续做转化分析

### 9.2 请求参数

```json
{
  "project_code": "st-petersburg-edu",
  "session_id": "sess_xxx",
  "visitor_id": "visitor_xxx",
  "events": [
    {
      "event_name": "chat_opened",
      "page": "/",
      "entry_point": "floating_button",
      "event_value": null,
      "timestamp": 1777000000
    }
  ]
}
```

### 9.3 关键事件

- `chat_opened`
- `quick_question_clicked`
- `message_sent`
- `lead_form_shown`
- `lead_form_submitted`
- `handoff_clicked`
- `wechat_exposed`

## 10. 错误码建议

建议统一错误码：

| 错误码              | 含义         |
| ------------------- | ------------ |
| `INVALID_PARAMS`    | 参数校验失败 |
| `SESSION_NOT_FOUND` | 会话不存在   |
| `FAQ_NOT_FOUND`     | FAQ 未命中   |
| `MODEL_ERROR`       | 模型调用失败 |
| `LEAD_SAVE_FAILED`  | 线索保存失败 |
| `HANDOFF_FAILED`    | 人工接管失败 |
| `INTERNAL_ERROR`    | 服务内部错误 |

## 11. 前端联调建议

### 11.1 聊天面板最少状态

前端需要维护：

- `isOpen`
- `sessionId`
- `visitorId`
- `messages`
- `loading`
- `intentLevel`
- `leadFormVisible`
- `handoffVisible`

### 11.2 推荐交互顺序

1. 用户打开聊天面板
2. 调用 `GET /api/faq` 获取快捷问题
3. 用户发送消息
4. 调用 `POST /api/ai/chat`
5. 根据 `actions` 展示表单或人工接管卡片
6. 用户提交表单后调用 `POST /api/leads`
7. 用户需要顾问时调用 `POST /api/handoff`

## 12. 服务实现建议

### 12.1 目录结构建议

推荐后续落地目录：

```text
src/
  app/
    api/
      ai/
        chat/route.ts
      leads/route.ts
      handoff/route.ts
      faq/route.ts
      events/route.ts
  components/
    ai-advisor/
      chat-launcher.tsx
      chat-panel.tsx
      quick-questions.tsx
      lead-capture-form.tsx
      handoff-card.tsx
  lib/
    ai/
      prompt.ts
      faq.ts
      intent.ts
      rules.ts
      types.ts
```

### 12.2 服务拆分建议

后端逻辑建议拆成：

- `buildPrompt()`
- `matchFaq()`
- `detectIntentLevel()`
- `buildActions()`
- `saveLead()`
- `createHandoff()`

这样后续更方便单独迭代。

## 13. 首版安全与风控建议

- 接口增加基础限流
- 过滤明显恶意输入
- 对联系方式做基本格式校验
- 对模型返回做二次规则拦截
- 对敏感词和高风险表述加白名单限制

## 14. 版本演进建议

### MVP 版本

- FAQ 驱动问答
- 规则驱动意向识别
- 基础留资
- 微信转接

### v1.1

- 增加会话总结
- 增加顾问跟进备注
- 增加知识命中率统计

### v1.2

- 接入向量检索
- 扩展多项目共用能力
- 增加管理后台 FAQ 编辑能力

## 15. 下一步建议

本文件可以直接作为以下开发的输入：

- `route.ts` API 骨架开发
- 前端聊天组件联调
- 数据表设计与建表
- AI 服务层函数拆分
- 埋点接入方案
