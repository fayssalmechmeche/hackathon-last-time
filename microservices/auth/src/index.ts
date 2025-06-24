import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import "dotenv/config";
import { authRouter } from "./routes/auth.js";

const app = new Hono();

app.use(logger());

const openApiDoc = {
  openapi: "3.0.0",
  info: {
    title: "Auth Service API",
    version: "1.0.0",
    description: "API for user authentication and management",
  },
  paths: {
    "/auth/register": {
      post: {
        summary: "Register a new user",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Invalid input" },
          500: { description: "Internal server error" },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Login a user",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
    },
  },
};

app.get("/openapi", (c) => c.json(openApiDoc));

app.get("/docs", swaggerUI({ url: "/openapi" }));

app.route("/auth", authRouter);

app.get("/health", (c) => c.text("OK"));

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
