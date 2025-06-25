// src/db/schema.ts
export interface Database {
  users: UsersTable;
  services: ServicesTable;
  service_routes: ServiceRoutesTable;
  service_route_parameters: ServiceRouteParametersTable;
}

export interface UsersTable {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  job_title: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ServicesTable {
  id: string;
  service_name: string;
  service_description: string | null;
  service_url: string;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceRoutesTable {
  id: string;
  service_id: string;
  route_path: string;
  route_method: string;
  route_summary: string | null;
  route_description: string | null;
  route_operation_id: string;
  created_at: Date;
}

export interface ServiceRouteParametersTable {
  id: string;
  service_route_id: string;
  parameter_name: string;
  parameter_in: string;
  parameter_description: string | null;
  parameter_required: boolean;
  parameter_type: string;
  parameter_format: string | null;
  created_at: Date;
}

// Export as DB for compatibility with existing code
export type DB = Database;
