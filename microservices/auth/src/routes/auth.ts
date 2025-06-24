import { Hono } from "hono";
import { z } from "zod";
import { handleRegister, handleLogin } from "../services/authService.js";
import { UserRole } from "../db/schema.js";

export const authRouter = new Hono();

authRouter.post("/register", async (c) => {
  const body = await c.req.json();
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.nativeEnum(UserRole),
  });
  const data = schema.parse(body);
  const result = await handleRegister(data);
  return c.json(result);
});

authRouter.post("/login", async (c) => {
  const body = await c.req.json();
  const { email, password } = body;
  const token = await handleLogin(email, password);
  return c.json({ token });
});
