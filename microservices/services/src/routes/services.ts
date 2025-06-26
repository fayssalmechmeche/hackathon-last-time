import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import status from "http-status";
import {
  handleCreateManualService,
  handleCreateAutomatedService,
  handleDeleteService,
  handleGetAllActiveServices,
  handleGetService,
  handleGetUserServices,
  handleUpdateService,
} from "../services/serviceService.js";
import { verifyJWT } from "../utils/auth.js";
import {
  CreateManualServiceSchema,
  CreateAutomatedServiceSchema,
  UpdateServiceSchema,
} from "../utils/validation.js";

type Variables = {
  userId: string;
};

export const servicesRouter = new Hono<{ Variables: Variables }>();

// JWT middleware
const jwtAuth = async (c: any, next: any) => {
  const authHeader = c.req.header("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new HTTPException(status.UNAUTHORIZED);
  }

  try {
    const token = authHeader.slice(7);
    const payload = verifyJWT(token);
    c.set("userId", payload.id);
    await next();
  } catch {
    throw new HTTPException(status.UNAUTHORIZED);
  }
};

// Create a new manual service
servicesRouter.post("/manual", jwtAuth, async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();

  const parseResult = CreateManualServiceSchema.safeParse(body);
  if (!parseResult.success) {
    throw new HTTPException(status.BAD_REQUEST, {
      message: "Invalid request data: " + parseResult.error.issues[0]?.message,
    });
  }

  try {
    const service = await handleCreateManualService(userId, parseResult.data);
    c.status(status.CREATED);
    return c.json(service);
  } catch (error) {
    console.error("Error creating manual service:", error);
    throw new HTTPException(status.INTERNAL_SERVER_ERROR, {
      message: "Failed to create service",
    });
  }
});

// Create a new automated service
servicesRouter.post("/automated", jwtAuth, async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();

  const parseResult = CreateAutomatedServiceSchema.safeParse(body);
  if (!parseResult.success) {
    throw new HTTPException(status.BAD_REQUEST, {
      message: "Invalid request data: " + parseResult.error.issues[0]?.message,
    });
  }

  try {
    const service = await handleCreateAutomatedService(
      userId,
      parseResult.data
    );
    c.status(status.CREATED);
    return c.json(service);
  } catch (error) {
    console.error("Error creating automated service:", error);
    throw new HTTPException(status.INTERNAL_SERVER_ERROR, {
      message: "Failed to create service",
    });
  }
});

// Get all services for the authenticated user
servicesRouter.get("/my", jwtAuth, async (c) => {
  const userId = c.get("userId");

  try {
    const services = await handleGetUserServices(userId);
    return c.json(services);
  } catch (error) {
    console.error("Error fetching user services:", error);
    throw new HTTPException(status.INTERNAL_SERVER_ERROR, {
      message: "Failed to fetch services",
    });
  }
});

// Get all active services (public endpoint)
servicesRouter.get("/active", async (c) => {
  try {
    const services = await handleGetAllActiveServices();
    return c.json(services);
  } catch (error) {
    console.error("Error fetching active services:", error);
    throw new HTTPException(status.INTERNAL_SERVER_ERROR, {
      message: "Failed to fetch services",
    });
  }
});

// Get a specific service by ID
servicesRouter.get("/:id", async (c) => {
  const serviceId = c.req.param("id");

  try {
    const service = await handleGetService(serviceId);
    if (!service) {
      throw new HTTPException(status.NOT_FOUND, {
        message: "Service not found",
      });
    }
    return c.json(service);
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    console.error("Error fetching service:", error);
    throw new HTTPException(status.INTERNAL_SERVER_ERROR, {
      message: "Failed to fetch service",
    });
  }
});

// Update a service
servicesRouter.put("/:id", jwtAuth, async (c) => {
  const userId = c.get("userId");
  const serviceId = c.req.param("id");
  const body = await c.req.json();

  const parseResult = UpdateServiceSchema.safeParse(body);
  if (!parseResult.success) {
    throw new HTTPException(status.BAD_REQUEST, {
      message: "Invalid request data: " + parseResult.error.issues[0]?.message,
    });
  }

  try {
    const updatedService = await handleUpdateService(
      serviceId,
      userId,
      parseResult.data
    );
    if (!updatedService) {
      throw new HTTPException(status.NOT_FOUND, {
        message: "Service not found",
      });
    }
    return c.json(updatedService);
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "service_not_found":
          throw new HTTPException(status.NOT_FOUND, {
            message: "Service not found",
          });
        case "unauthorized_access":
          throw new HTTPException(status.FORBIDDEN, {
            message: "You don't have permission to update this service",
          });
        default:
          console.error("Error updating service:", error);
          throw new HTTPException(status.INTERNAL_SERVER_ERROR, {
            message: "Failed to update service",
          });
      }
    }
    throw new HTTPException(status.INTERNAL_SERVER_ERROR);
  }
});

// Delete a service
servicesRouter.delete("/:id", jwtAuth, async (c) => {
  const userId = c.get("userId");
  const serviceId = c.req.param("id");

  try {
    const deleted = await handleDeleteService(serviceId, userId);
    if (!deleted) {
      throw new HTTPException(status.NOT_FOUND, {
        message: "Service not found",
      });
    }
    c.status(status.NO_CONTENT);
    return c.body(null);
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "service_not_found":
          throw new HTTPException(status.NOT_FOUND, {
            message: "Service not found",
          });
        case "unauthorized_access":
          throw new HTTPException(status.FORBIDDEN, {
            message: "You don't have permission to delete this service",
          });
        default:
          console.error("Error deleting service:", error);
          throw new HTTPException(status.INTERNAL_SERVER_ERROR, {
            message: "Failed to delete service",
          });
      }
    }
    throw new HTTPException(status.INTERNAL_SERVER_ERROR);
  }
});
