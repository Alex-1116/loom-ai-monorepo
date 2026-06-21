import type {
  WorkflowNodeData,
  WorkflowNodeType,
} from "@/components/workflows/editor/model/types/workflow-node"

export const DEFAULT_PROMPT_NODE_CONTENT =
  'Hipster Sisyphus, lime overall suit, pushing a huge round rock up a hill. The rock is sprayed with the text "default prompt", bright grey background extreme side long shot, cinematic, fashion style, side view'

export const WORKFLOW_NODE_DEFAULTS: Record<
  WorkflowNodeType,
  WorkflowNodeData
> = {
  prompt: {
    title: "Prompt",
    content: DEFAULT_PROMPT_NODE_CONTENT,
  },
  file: {
    title: "File",
  },
  export: {
    title: "Export",
    inputLabel: "Input",
    actionLabel: "Export",
  },
}
