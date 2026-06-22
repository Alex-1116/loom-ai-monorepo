import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const imageModelNodeSchema: WorkflowNodeSchema = {
  type: "image-model",
  fields: [
    {
      key: "title",
      label: "Title",
      input: "text",
      placeholder: "Model title",
      rules: [
        {
          kind: "required",
          level: "warning",
          code: "node.image-model.title.missing",
          message: "Image model node title is empty.",
        },
      ],
    },
    {
      key: "modelKey",
      label: "Model Key",
      input: "text",
      placeholder: "flux-2-pro",
    },
    {
      key: "runLabel",
      label: "Run Label",
      input: "text",
      placeholder: "Run Model",
    },
    {
      key: "addInputLabel",
      label: "Add Input Label",
      input: "text",
      placeholder: "Add another image input",
    },
  ],
}
