-- Bulk provider import (F1). New table.
CREATE TABLE IF NOT EXISTS bulk_imports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id uuid NOT NULL REFERENCES users(id),
  entity_type varchar(50) NOT NULL,
  file_name varchar(255),
  rows_total integer DEFAULT 0,
  rows_success integer DEFAULT 0,
  rows_failed integer DEFAULT 0,
  error_log jsonb,
  status varchar(20) NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bulk_imports_admin ON bulk_imports (admin_id, created_at DESC);
