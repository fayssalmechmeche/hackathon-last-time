export interface ServiceDocument {
  _id: string; // UUID as document ID
  title: string;
  description: string;
  iconName: string;
  gradient: string;
  status: "active" | "inactive";
  type: "automatic" | "manual";
  swaggerUrl?: string; // For automatic services
  endpointUrl?: string; // For manual services - the actual LLM API endpoint
  apiKey?: string; // For manual services - API key for authentication
  apiKeyHeader?: string; // For manual services - HTTP header name for the API key
  jsonSchema?: object; // Generated JSON Schema for dynamic forms
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID who created the service
}

export type ServiceDocumentInsert = Omit<ServiceDocument, "createdAt" | "updatedAt">;
export type ServiceDocumentUpdate = Partial<Omit<ServiceDocument, "_id" | "createdAt" | "updatedAt">>;

export interface FormField {
  id: number;
  type: "file" | "text" | "number" | "date" | "select";
  label: string;
  required: boolean;
  options?: string[];
}

export interface GeneratedJSONSchema {
  type: "object";
  properties: Record<string, any>;
  required: string[];
  title: string;
  description: string;
}
