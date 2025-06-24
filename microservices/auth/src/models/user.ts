import { db } from "../db/client.js";
import type { UserTable, UserTableInsert, UserTableUpdate } from "../db/schema.js";

export async function findUserByEmail(
  email: string,
): Promise<UserTable | undefined> {
  return await db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();
}

export async function findUserById(
  id: string,
): Promise<UserTable | undefined> {
  return await db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function createUser({
  id,
  email,
  password_hash,
  full_name,
  job_title,
}: UserTableInsert) {
  return await db
    .insertInto("users")
    .values({
      id,
      email,
      password_hash,
      full_name,
      job_title,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .executeTakeFirst();
}

export async function updateUser(id: string, updates: UserTableUpdate) {
  return await db
    .updateTable("users")
    .set({
      ...updates,
      updated_at: new Date(),
    })
    .where("id", "=", id)
    .executeTakeFirst();
}
