import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const fileNodeSchema: WorkflowNodeSchema = {
  type: "file",
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
          code: "node.file.title.missing",
          message: "File node title is empty.",
        },
      ],
    },
  ],
}
