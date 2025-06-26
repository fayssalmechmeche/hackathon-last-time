import type { FormField, GeneratedJSONSchema } from "../db/schema.js";

export function generateJSONSchemaFromFields(
  title: string,
  description: string,
  fields: FormField[]
): GeneratedJSONSchema {
  const properties: Record<string, any> = {};
  const required: string[] = [];

  fields.forEach((field) => {
    const fieldName = field.label.toLowerCase().replace(/\s+/g, "_");
    
    // Build the property definition based on field type
    switch (field.type) {
      case "text":
        properties[fieldName] = {
          type: "string",
          title: field.label,
        };
        break;
      
      case "number":
        properties[fieldName] = {
          type: "number",
          title: field.label,
        };
        break;
      
      case "date":
        properties[fieldName] = {
          type: "string",
          format: "date",
          title: field.label,
        };
        break;
      
      case "select":
        properties[fieldName] = {
          type: "string",
          title: field.label,
          enum: field.options || [],
        };
        break;
      
      case "file":
        properties[fieldName] = {
          type: "string",
          format: "data-url",
          title: field.label,
        };
        break;
      
      default:
        properties[fieldName] = {
          type: "string",
          title: field.label,
        };
    }

    // Add to required array if field is required
    if (field.required) {
      required.push(fieldName);
    }
  });

  return {
    type: "object",
    title,
    description,
    properties,
    required,
  };
}
