import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { connectToDatabase } from "./db/client.js";
import { servicesRouter } from "./routes/index.js";

const app = new Hono();

app.use(logger());
app.use(
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.route("/services", servicesRouter);

app.get("/health", (c) => c.text("OK"));

// Initialize database connection and start server
connectToDatabase()
  .then(() => {
    serve(
      {
        fetch: app.fetch,
        port: 3002,
      },
      (info) => {
        console.log(
          `Services microservice running on http://localhost:${info.port}`
        );
      }
    );
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });
