import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import status from "http-status";
import { z } from "zod";
import { findUserById, updateUser } from "../models/user.js";
import {
  handleLogin,
  handleRegister,
  verifyJWT,
} from "../services/authService.js";

type Variables = {
  userId: string;
};

export const authRouter = new Hono<{ Variables: Variables }>();

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

authRouter.post("/register", async (c) => {
  const body = await c.req.json();
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    full_name: z.string().min(1, "Full name is required"),
    job_title: z.string().min(1, "Job title is required"),
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

authRouter.get("/profile", jwtAuth, async (c) => {
  const userId = c.get("userId");
  
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new HTTPException(status.NOT_FOUND);
    }
    
    const { password_hash, ...profile } = user;
    return c.json(profile);
  } catch (error) {
    throw new HTTPException(status.INTERNAL_SERVER_ERROR);
  }
});

authRouter.patch("/profile", jwtAuth, async (c) => {
  const userId = c.get("userId");
  
  const body = await c.req.json();
  const schema = z.object({
    full_name: z.string().optional(),
    job_title: z.string().optional(),
  });

  const parseResult = schema.safeParse(body);
  if (!parseResult.success) {
    throw new HTTPException(status.BAD_REQUEST);
  }

  try {
    await updateUser(userId, parseResult.data);
    
    const updatedUser = await findUserById(userId);
    if (!updatedUser) {
      throw new HTTPException(status.NOT_FOUND);
    }

    const { password_hash, ...profile } = updatedUser;
    return c.json(profile);
  } catch (error) {
    throw new HTTPException(status.INTERNAL_SERVER_ERROR);
  }
});
