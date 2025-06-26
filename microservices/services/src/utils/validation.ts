import { z } from "zod";

export const FormFieldSchema = z.object({
  id: z.number(),
  type: z.enum(["file", "text", "number", "date", "select"]),
  label: z.string().min(1),
  placeholder: z.string(),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

export const CreateManualServiceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  iconName: z.string().min(1, "Icon is required"),
  gradient: z.string().min(1, "Gradient is required"),
  status: z.enum(["active", "inactive"]),
  endpointUrl: z.string().url("Invalid endpoint URL"),
  fields: z.array(FormFieldSchema).min(1, "At least one field is required"),
});

export const CreateAutomatedServiceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  iconName: z.string().min(1, "Icon is required"),
  gradient: z.string().min(1, "Gradient is required"),
  status: z.enum(["active", "inactive"]),
  swaggerUrl: z.string().url("Invalid swagger URL"),
});

export const UpdateServiceSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  iconName: z.string().min(1).optional(),
  gradient: z.string().min(1).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  endpointUrl: z.string().url().optional(),
  jsonSchema: z.object({}).optional(),
});

export type CreateManualServiceRequest = z.infer<
  typeof CreateManualServiceSchema
>;
export type CreateAutomatedServiceRequest = z.infer<
  typeof CreateAutomatedServiceSchema
>;
export type UpdateServiceRequest = z.infer<typeof UpdateServiceSchema>;
