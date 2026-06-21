import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const exportNodeSchema: WorkflowNodeSchema = {
  type: "export",
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
          code: "node.export.title.missing",
          message: "Export node title is empty.",
        },
      ],
    },
    {
      key: "inputLabel",
      label: "Input Label",
      input: "text",
      placeholder: "Input label",
    },
    {
      key: "actionLabel",
      label: "Action Label",
      input: "text",
      placeholder: "Action label",
      rules: [
        {
          kind: "required",
          level: "warning",
          code: "node.export.action-label.missing",
          message: "Export node action label is empty.",
        },
      ],
    },
  ],
}
