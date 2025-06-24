export enum UserRole {
  COMPANY = "company",
  DEVELOPER = "developer",
}

export interface UserTable {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
}

export type UserTableInsert = Omit<UserTable, "id" | "created_at">;

export interface DB {
  users: UserTable;
}
