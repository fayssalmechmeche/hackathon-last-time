import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/user.js";

const SALT_ROUNDS = 10;

const JWT_SECRET = process.env.JWT_SECRET!;
const EXPIRES_IN = "7d";

export async function handleRegister({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string> {
  const existing = await findUserByEmail(email);

  if (existing) {
    throw new Error("user_already_exists");
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const id = randomUUID();

  const result = await createUser({ id, email, password_hash });

  if (!result.numInsertedOrUpdatedRows) {
    throw new Error("user_creation_failed");
  }

  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: EXPIRES_IN });

  return token;
}

export async function handleLogin(
  email: string,
  password: string
): Promise<string> {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("user_not_found");
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new Error("invalid_password");
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
}
