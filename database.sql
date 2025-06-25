CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  job_title TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY,
  service_name TEXT NOT NULL,
  service_description TEXT,
  service_url TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS service_routes (
  id UUID PRIMARY KEY,
  service_id UUID NOT NULL,
  route_path TEXT NOT NULL,
  route_method TEXT NOT NULL,
  route_summary TEXT,
  route_description TEXT,
  route_operation_id TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (service_id) REFERENCES services(id)
);
CREATE TABLE IF NOT EXISTS service_route_parameters (
  id UUID PRIMARY KEY,
  service_route_id UUID NOT NULL,
  parameter_name TEXT NOT NULL,
  parameter_in TEXT NOT NULL,
  parameter_description TEXT,
  parameter_required BOOLEAN NOT NULL DEFAULT FALSE,
  parameter_type TEXT NOT NULL,
  parameter_format TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (service_route_id) REFERENCES service_routes(id)
);