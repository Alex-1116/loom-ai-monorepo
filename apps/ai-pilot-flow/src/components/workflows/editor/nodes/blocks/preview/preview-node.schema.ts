import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const previewNodeSchema: WorkflowNodeSchema = {
  type: "preview",
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
          code: "node.preview.title.missing",
          message: "Preview node title is empty.",
        },
      ],
    },
    {
      key: "inputLabel",
      label: "Input Label",
      input: "text",
      placeholder: "Input label",
    },
  ],
}
