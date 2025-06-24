export interface UserTable {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  job_title: string | null;
  created_at: Date;
  updated_at: Date;
}

export type UserTableInsert = Omit<UserTable, "created_at" | "updated_at">;
export type UserTableUpdate = Partial<Omit<UserTable, "id" | "created_at" | "updated_at">>;

export interface DB {
  users: UserTable;
}
