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
}) {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error("email_already_exists");

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const id = await createUser({ email, password_hash, role });

  if (!id) {
    throw new Error("error_creating_user");
  }

  const token = jwt.sign({ id, role }, JWT_SECRET, { expiresIn: EXPIRES_IN });
  return { token };
}

export async function handleLogin(email: string, password: string) {
  const user = await findUserByEmail(email);

  if (!user) throw new Error("uer_not_found");

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error("user_not_found");

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
}
