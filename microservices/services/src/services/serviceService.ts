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
    modelId: serviceData.modelId,
    jsonSchema,
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
    modelId: serviceData.modelId,
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

export async function handleExecuteService(
  serviceId: string,
  inputData: Record<string, unknown>,
  userId: string
): Promise<{ response: string }> {
  const service = await findServiceById(serviceId);
  if (!service) {
    throw new Error("service_not_found");
  }

  if (service.status !== "active") {
    throw new Error("service_inactive");
  }

  // Convert input data to text message
  const userMessage = Object.entries(inputData)
    .map(([key, value]) => {
      if (typeof value === "string" && value.startsWith("data:")) {
        // Handle base64 files - include full data for LLM processing
        return `${key}: ${value}`;
      }
      return `${key}: ${String(value)}`;
    })
    .join(", ");

  // Prepare OpenAI-compatible request
  const requestBody = {
    model: service.modelId,
    messages: [
      {
        role: "user",
        content: userMessage,
      },
    ],
  };

  // Set up headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (service.apiKey && service.apiKeyHeader) {
    headers[service.apiKeyHeader] = service.apiKey;
  }

  try {
    const response = await axios.post(service.endpointUrl!, requestBody, {
      headers,
    });

    const responseContent = response.data.choices?.[0]?.message?.content;
    if (!responseContent) {
      throw new Error("Invalid response format from service API");
    }

    return { response: responseContent };
  } catch (error) {
    console.error("Service API error:", error);
    throw new Error("service_api_error");
  }
}
