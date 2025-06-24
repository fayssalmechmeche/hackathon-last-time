import { Hono } from "hono";
import { z } from "zod";
import { handleRegister, handleLogin } from "../services/authService.js";
import { HTTPException } from "hono/http-exception";
import status from "http-status";

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

  const result = await handleRegister(data);

  c.status(status.CREATED);
  return c.json(result);
});

authRouter.post("/login", async (c) => {
  const body = await c.req.json();
  const { email, password } = body;
  const { success, token } = await handleLogin(email, password);

  if (!success) {
    throw new HTTPException(status.UNAUTHORIZED);
  }

  c.status(status.OK);
  return c.json({ token });
});
