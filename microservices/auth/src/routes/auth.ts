import { Hono } from "hono";
import { z } from "zod";
import { handleRegister, handleLogin } from "../services/authService.js";
import { UserRole } from "../db/schema.js";
import { HTTPException } from "hono/http-exception";
import status from "http-status";

export const authRouter = new Hono();

authRouter.post("/register", async (c) => {
  const body = await c.req.json();
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.nativeEnum(UserRole),
  });

  const parseResult = schema.safeParse(body);

  if (!parseResult.success) {
    throw new HTTPException(status.BAD_REQUEST);
  }

  const { data } = parseResult;

  const result = await handleRegister(data);

  return c.json(result);
});

authRouter.post("/login", async (c) => {
  const body = await c.req.json();
  const { email, password } = body;
  const { success, token } = await handleLogin(email, password);

  if (!success) {
    throw new HTTPException(status.UNAUTHORIZED);
  }

  return c.json({ token });
});
