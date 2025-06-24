import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import status from "http-status";
import { z } from "zod";
import { handleLogin, handleRegister } from "../services/authService.js";

export const authRouter = new Hono();

authRouter.post("/register", async (c) => {
  const body = await c.req.json();
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const parseResult = schema.safeParse(body);

  if (!parseResult.success) {
    throw new HTTPException(status.BAD_REQUEST);
  }

  const { data } = parseResult;

  try {
    const token = await handleRegister(data);
    c.status(status.CREATED);
    return c.json({ token });
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "user_already_exists":
          throw new HTTPException(status.CONFLICT);
        case "user_creation_failed":
          throw new HTTPException(status.INTERNAL_SERVER_ERROR);
        default:
          throw new HTTPException(status.INTERNAL_SERVER_ERROR);
      }
    }
    throw new HTTPException(status.INTERNAL_SERVER_ERROR);
  }
});

authRouter.post("/login", async (c) => {
  const body = await c.req.json();
  const { email, password } = body;

  try {
    const token = await handleLogin(email, password);
    c.status(status.OK);
    return c.json({ token });
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "user_not_found":
        case "invalid_password":
          throw new HTTPException(status.UNAUTHORIZED);
        default:
          throw new HTTPException(status.INTERNAL_SERVER_ERROR);
      }
    }
    throw new HTTPException(status.INTERNAL_SERVER_ERROR);
  }
});
