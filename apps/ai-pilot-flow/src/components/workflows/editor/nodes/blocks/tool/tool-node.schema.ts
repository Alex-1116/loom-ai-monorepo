import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const toolNodeSchema: WorkflowNodeSchema = {
  type: "tool",
  fields: [
    {
      key: "title",
      label: "Title",
      input: "text",
      placeholder: "Tool title",
      rules: [
        {
          kind: "required",
          level: "warning",
          code: "node.tool.title.missing",
          message: "Tool node title is empty.",
        },
      ],
    },
    {
      key: "toolKey",
      label: "Tool Key",
      input: "text",
      placeholder: "rotate-and-flip",
    },
    {
      key: "toolCategory",
      label: "Category",
      input: "text",
      placeholder: "Editing",
    },
    {
      key: "runLabel",
      label: "Run Label",
      input: "text",
      placeholder: "Run Tool",
    },
    {
      key: "addInputLabel",
      label: "Add Input Label",
      input: "text",
      placeholder: "Add input",
    },
  ],
}
