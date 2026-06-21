import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const importMultipleLorasNodeSchema: WorkflowNodeSchema = {
  type: "import-multiple-loras",
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
          code: "node.import-multiple-loras.title.missing",
          message: "Import Multiple LoRAs node title is empty.",
        },
      ],
    },
    {
      key: "outputLabel",
      label: "Primary Output Label",
      input: "text",
      placeholder: "Primary output label",
      rules: [
        {
          kind: "required",
          level: "warning",
          code: "node.import-multiple-loras.output-label.missing",
          message: "Import Multiple LoRAs primary output label is empty.",
        },
      ],
    },
    {
      key: "secondaryOutputLabel",
      label: "Secondary Output Label",
      input: "text",
      placeholder: "Secondary output label",
      rules: [
        {
          kind: "required",
          level: "warning",
          code: "node.import-multiple-loras.secondary-output-label.missing",
          message: "Import Multiple LoRAs secondary output label is empty.",
        },
      ],
    },
  ],
}
