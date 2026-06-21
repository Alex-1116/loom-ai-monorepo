import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const promptNodeSchema: WorkflowNodeSchema = {
  type: "prompt",
  fields: [
    {
      key: "title",
      label: "Title",
      input: "text",
      placeholder: "Node title",
      rules: [
        {
          kind: "required",
          level: "warning",
          code: "node.prompt.title.missing",
          message: "Prompt node title is empty.",
        },
      ],
    },
    {
      key: "content",
      label: "Content",
      input: "textarea",
      placeholder: "Describe what this prompt node should do",
      rules: [
        {
          kind: "required",
          level: "warning",
          code: "node.prompt.content.missing",
          message: "Prompt node content is empty.",
        },
      ],
    },
  ],
}
