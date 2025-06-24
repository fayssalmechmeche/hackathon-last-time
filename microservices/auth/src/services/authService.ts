import { createUser, findUserByEmail } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { UserRole } from "../db/schema.js";

const SALT_ROUNDS = 10;

const JWT_SECRET = process.env.JWT_SECRET!;
const EXPIRES_IN = "7d";

export async function handleRegister({
  email,
  password,
  role,
}: {
  email: string;
  password: string;
  role: UserRole;
}): Promise<{ success: boolean; token: string | undefined }> {
  const existing = await findUserByEmail(email);

  if (existing) {
    console.log("User already exists:", email);
    return { success: false, token: undefined };
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const id = await createUser({ email, password_hash, role });

  if (!id) {
    console.error("Failed to create user:", email);
    return { success: false, token: undefined };
  }

  const token = jwt.sign({ id, role }, JWT_SECRET, { expiresIn: EXPIRES_IN });
  return { success: true, token };
}

export async function handleLogin(
  email: string,
  password: string,
): Promise<{ success: boolean; token: string | undefined }> {
  const user = await findUserByEmail(email);

  if (!user) {
    console.log("User not found:", email);
    return { success: false, token: undefined };
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    console.log("Invalid password for user:", email);
    return { success: false, token: undefined };
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return { success: true, token };
}
