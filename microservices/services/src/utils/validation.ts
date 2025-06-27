import { z } from "zod";

export const FormFieldSchema = z.object({
  id: z.number(),
  type: z.enum(["file", "text", "number", "date", "select", "array"]),
  label: z.string().min(1),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  linkedBodyField: z.string().optional(), // ID du champ body lié
});

export const BodyFieldSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.number(),
    type: z.enum([
      "file",
      "text",
      "number",
      "date",
      "select",
      "object",
      "array",
    ]),
    label: z.string().min(1),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
    children: z.array(BodyFieldSchema).optional(),
    expanded: z.boolean().optional(),
  })
);

export const CreateManualServiceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  iconName: z.string().min(1, "Icon is required"),
  gradient: z.string().min(1, "Gradient is required"),
  status: z.enum(["active", "inactive"]),
  endpointUrl: z.string().url("Invalid endpoint URL"),
  apiKey: z.string().min(1, "API key is required"),
  apiKeyHeader: z.string().min(1, "API key header is required"),
  fields: z.array(FormFieldSchema).min(1, "At least one field is required"),
  bodyStructure: z.array(BodyFieldSchema).optional(), // Structure du body
});

export const CreateAutomatedServiceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  iconName: z.string().min(1, "Icon is required"),
  gradient: z.string().min(1, "Gradient is required"),
  status: z.enum(["active", "inactive"]),
  swaggerUrl: z.string().url("Invalid swagger URL"),
  endpointUrl: z.string().url("Invalid endpoint URL"),
});

export const UpdateServiceSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  iconName: z.string().min(1).optional(),
  gradient: z.string().min(1).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  endpointUrl: z.string().url().optional(),
  apiKey: z.string().min(1).optional(),
  apiKeyHeader: z.string().min(1).optional(),
  jsonSchema: z.object({}).optional(),
});

export type CreateManualServiceRequest = z.infer<
  typeof CreateManualServiceSchema
>;
export type CreateAutomatedServiceRequest = z.infer<
  typeof CreateAutomatedServiceSchema
>;
export type UpdateServiceRequest = z.infer<typeof UpdateServiceSchema>;
