import type { WorkflowNodeSchema } from "@/components/workflows/editor/model/schema/node-schema"

export const threeDModelNodeSchema: WorkflowNodeSchema = {
  type: "3d-model",
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
          code: "node.3d-model.title.missing",
          message: "3D model node title is empty.",
        },
      ],
    },
    {
      key: "modelKey",
      label: "Model Key",
      input: "text",
      placeholder: "meshy-v6",
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
      placeholder: "Add image input",
    },
  ],
}
