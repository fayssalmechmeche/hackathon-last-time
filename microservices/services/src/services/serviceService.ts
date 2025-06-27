import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import type { ServiceDocument } from "../db/schema.js";
import {
  createService,
  deleteService,
  findAllActiveServices,
  findServiceById,
  findServicesByUserId,
  updateService,
} from "../models/service.js";
import type {
  CreateAutomatedServiceRequest,
  CreateManualServiceRequest,
  UpdateServiceRequest,
} from "../utils/validation.js";
import { generateJSONSchemaFromFields } from "./schemaGenerator.js";

export async function handleCreateManualService(
  userId: string,
  serviceData: CreateManualServiceRequest
): Promise<ServiceDocument> {
  // Generate JSON Schema from the provided fields
  const jsonSchema = generateJSONSchemaFromFields(
    serviceData.title,
    serviceData.fields
  );

  // Create the service document
  const serviceDocument = {
    _id: uuidv4(),
    title: serviceData.title,
    description: serviceData.description,
    iconName: serviceData.iconName,
    gradient: serviceData.gradient,
    status: serviceData.status,
    type: "manual" as const,
    endpointUrl: serviceData.endpointUrl,
    apiKey: serviceData.apiKey,
    apiKeyHeader: serviceData.apiKeyHeader,
    jsonSchema,
    fields: serviceData.fields, // Store form fields with links
    bodyStructure: serviceData.bodyStructure, // Store body structure
    createdBy: userId,
  };

  return await createService(serviceDocument);
}

export async function handleCreateAutomatedService(
  userId: string,
  serviceData: CreateAutomatedServiceRequest
): Promise<ServiceDocument> {
  // Generate JSON Schema from the provided fields

  const response = await axios.post("http://localhost:3001/swagger/import", {
    link: serviceData.swaggerUrl,
  });

  const jsonSchema = response.data;

  // Create the service document
  const serviceDocument = {
    _id: uuidv4(),
    title: serviceData.title,
    description: serviceData.description,
    iconName: serviceData.iconName,
    gradient: serviceData.gradient,
    status: serviceData.status,
    type: "automatic" as const,
    swaggerUrl: serviceData.swaggerUrl,
    endpointUrl: serviceData.endpointUrl,
    jsonSchema,
    createdBy: userId,
  };

  return await createService(serviceDocument);
}

export async function handleGetService(
  serviceId: string
): Promise<ServiceDocument | null> {
  return await findServiceById(serviceId);
}

export async function handleGetUserServices(
  userId: string
): Promise<ServiceDocument[]> {
  return await findServicesByUserId(userId);
}

export async function handleGetAllActiveServices(): Promise<ServiceDocument[]> {
  return await findAllActiveServices();
}

export async function handleUpdateService(
  serviceId: string,
  userId: string,
  updates: UpdateServiceRequest
): Promise<ServiceDocument | null> {
  // First check if the service exists and belongs to the user
  const existingService = await findServiceById(serviceId);
  if (!existingService) {
    throw new Error("service_not_found");
  }

  if (existingService.createdBy !== userId) {
    throw new Error("unauthorized_access");
  }

  return await updateService(serviceId, updates);
}

export async function handleDeleteService(
  serviceId: string,
  userId: string
): Promise<boolean> {
  // First check if the service exists and belongs to the user
  const existingService = await findServiceById(serviceId);
  if (!existingService) {
    throw new Error("service_not_found");
  }

  if (existingService.createdBy !== userId) {
    throw new Error("unauthorized_access");
  }

  return await deleteService(serviceId);
}

/**
 * Execute a service by mapping form data to the API body structure
 */
export async function executeService(
  serviceId: string,
  formData: Record<string, any>
): Promise<any> {
  // Get the service configuration
  const service = await findServiceById(serviceId);
  if (!service) {
    throw new Error("service_not_found");
  }

  if (service.status !== "active") {
    throw new Error("service_inactive");
  }

  if (!service.endpointUrl) {
    throw new Error("no_endpoint_configured");
  }

  // Build the request body based on the service configuration
  let requestBody: any = {};

  if (service.type === "manual" && service.fields && service.bodyStructure) {
    // Map form data to body structure using the linkedBodyField
    requestBody = mapFormDataToBody(
      formData,
      service.fields,
      service.bodyStructure
    );
  } else if (service.type === "automatic" && service.jsonSchema) {
    // For automatic services, use the form data directly
    requestBody = formData;
  } else {
    // Fallback: use form data as is
    requestBody = formData;
  }

  // Prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add API key if configured
  if (service.apiKey && service.apiKeyHeader) {
    headers[service.apiKeyHeader] = service.apiKey;
  }

  try {
    // Make the API call
    const response = await axios.post(service.endpointUrl, requestBody, {
      headers,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error executing service:", error);
    throw new Error(`api_call_failed: ${error.message}`);
  }
}

/**
 * Map form data to body structure using field links
 */
function mapFormDataToBody(
  formData: Record<string, any>,
  fields: any[],
  bodyStructure: any[]
): any {
  const result: any = {};

  // Create a map of body field IDs to their paths and info
  const bodyFieldMap = new Map<string, { path: string; field: any }>();

  function collectBodyFields(structure: any[], prefix = ""): void {
    structure.forEach((field) => {
      const path = prefix ? `${prefix}.${field.label}` : field.label;
      bodyFieldMap.set(field.id.toString(), { path, field });

      if (field.children && field.children.length > 0) {
        collectBodyFields(field.children, path);
      }
    });
  }

  collectBodyFields(bodyStructure);

  // Map each form field to its linked body field
  fields.forEach((formField) => {
    if (formField.linkedBodyField && formData[formField.label] !== undefined) {
      const bodyFieldInfo = bodyFieldMap.get(formField.linkedBodyField);
      if (bodyFieldInfo) {
        const value = processFieldValue(
          formData[formField.label],
          formField,
          bodyFieldInfo.field
        );
        setNestedValue(result, bodyFieldInfo.path, value);
      }
    }
  });

  return result;
}

/**
 * Process field value based on field types
 */
function processFieldValue(value: any, formField: any, bodyField: any): any {
  // Handle different field types
  switch (bodyField.type) {
    case "number":
      return typeof value === "string" ? parseFloat(value) : value;
    case "text":
      return String(value);
    case "file":
      // For files, you might want to handle base64 data or file uploads
      return value;
    case "date":
      return value;
    case "select":
      return value;
    case "array":
      // Handle array values - expect comma-separated string or already parsed array
      if (typeof value === "string") {
        return value.split(",").map((item) => item.trim());
      }
      return Array.isArray(value) ? value : [value];
    case "object":
      // For objects, value should already be an object
      return typeof value === "object" ? value : {};
    default:
      return value;
  }
}

/**
 * Set a nested value in an object using dot notation
 * Handles arrays and objects appropriately
 */
function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current)) {
      // Determine if next level should be array or object
      const nextKey = keys[i + 1];
      const isArrayIndex = /^\d+$/.test(nextKey);
      current[key] = isArrayIndex ? [] : {};
    } else if (typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }

  const finalKey = keys[keys.length - 1];
  current[finalKey] = value;
}

/**
 * Debug function to test the mapping logic
 */
export function debugMapping(
  formData: Record<string, any>,
  fields: any[],
  bodyStructure: any[]
): { originalFormData: any; mappedBody: any; mapping: any[] } {
  const mappedBody = mapFormDataToBody(formData, fields, bodyStructure);

  // Create a mapping report
  const mapping = fields
    .filter((field) => field.linkedBodyField)
    .map((field) => ({
      formField: field.label,
      formValue: formData[field.label],
      bodyFieldId: field.linkedBodyField,
      bodyPath: "calculated in mapping",
    }));

  return {
    originalFormData: formData,
    mappedBody,
    mapping,
  };
}
