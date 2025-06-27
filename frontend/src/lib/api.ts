import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types for services API
export interface CreateManualServiceRequest {
  title: string;
  description: string;
  iconName: string;
  gradient: string;
  status: "active" | "inactive";
  baseUrl: string;
  apiKey: string;
  apiKeyHeader: string;
  modelId: string;
  fields: Array<{
    id: number;
    type: "file" | "text" | "number" | "date" | "select";
    label: string;
    required: boolean;
    options?: string[];
  }>;
}

export interface CreateAutomatedServiceRequest {
  title: string;
  description: string;
  iconName: string;
  gradient: string;
  status: "active" | "inactive";
  swaggerUrl: string;
  endpointUrl: string;
}

export interface UpdateServiceRequest {
  title?: string;
  description?: string;
  iconName?: string;
  gradient?: string;
  status?: "active" | "inactive";
  baseUrl?: string;
  apiKey?: string;
  apiKeyHeader?: string;
  modelId?: string;
  jsonSchema?: object;
}

export interface ServiceResponse {
  _id: string;
  title: string;
  description: string;
  iconName: string;
  gradient: string;
  status: "active" | "inactive";
  type: "automatic" | "manual";
  swaggerUrl?: string;
  baseUrl?: string;
  apiKey?: string;
  apiKeyHeader?: string;
  modelId?: string;
  jsonSchema?: object;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// OpenAI Models API response types
export interface OpenAIModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

export interface OpenAIModelsResponse {
  object: string;
  data: OpenAIModel[];
}

// Services API endpoints
const SERVICES_BASE_URL = "http://localhost:3002";
const SWAGGER_BASE_URL = "http://localhost:3001";

export const servicesApi = axios.create({
  baseURL: SERVICES_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const swaggerApi = axios.create({
  baseURL: SWAGGER_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to services requests if available
servicesApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Services API methods
export const servicesApiMethods = {
  createManualService: (serviceData: CreateManualServiceRequest) =>
    servicesApi.post("/services/manual", serviceData),

  createAutomatedService: (serviceData: CreateAutomatedServiceRequest) =>
    servicesApi.post("/services/automated", serviceData),

  getUserServices: () => servicesApi.get("/services/my"),

  getActiveServices: () => servicesApi.get("/services/active"),

  getService: (id: string) => servicesApi.get(`/services/${id}`),

  updateService: (id: string, updates: UpdateServiceRequest) =>
    servicesApi.put(`/services/${id}`, updates),

  deleteService: (id: string) => servicesApi.delete(`/services/${id}`),

  executeService: (id: string, inputData: Record<string, unknown>) =>
    servicesApi.post(`/services/${id}/execute`, inputData),

  analyzeSwagger: (swaggerUrl: string) =>
    swaggerApi.post("/swagger/import", { link: swaggerUrl }),

  getSwaggerRoutes: (swaggerUrl: string) =>
    swaggerApi.get(`/swagger/routes/${swaggerUrl}`),

  // Fetch available models from OpenAI-compatible API
  fetchModels: async (baseUrl: string, apiKey?: string, apiKeyHeader?: string): Promise<OpenAIModel[]> => {
    const cleanBaseUrl = baseUrl.replace(/\/$/, "");
    const modelsUrl = `${cleanBaseUrl}/v1/models`;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (apiKey && apiKeyHeader) {
      headers[apiKeyHeader] = apiKey;
    }
    
    const response = await axios.get<OpenAIModelsResponse>(modelsUrl, { headers });
    return response.data.data;
  },
};
