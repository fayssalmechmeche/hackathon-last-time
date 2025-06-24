import { randomUUID } from "crypto";
import { db } from "../db/client.js";
import type { UserTable, UserTableInsert } from "../db/schema.js";

export async function findUserByEmail(
  email: string,
): Promise<UserTable | undefined> {
  return await db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();
}

export async function createUser({ email, password_hash }: UserTableInsert) {
  return await db
    .insertInto("users")
    .values({
      id: randomUUID(),
      email,
      password_hash,
      created_at: new Date(),
    })
    .executeTakeFirst();
}
