export interface UserTable {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export type UserTableInsert = Omit<UserTable, "created_at">;

export interface DB {
  users: UserTable;
}
