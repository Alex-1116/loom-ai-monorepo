import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const importLoraNodeSchema: WorkflowNodeSchema = {
  type: "import-lora",
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
          code: "node.import-lora.title.missing",
          message: "Import LoRA node title is empty.",
        },
      ],
    },
    {
      key: "outputLabel",
      label: "Output Label",
      input: "text",
      placeholder: "Output label",
      rules: [
        {
          kind: "required",
          level: "warning",
          code: "node.import-lora.output-label.missing",
          message: "Import LoRA output label is empty.",
        },
      ],
    },
  ],
}
