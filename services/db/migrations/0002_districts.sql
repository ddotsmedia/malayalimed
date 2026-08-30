CREATE TABLE IF NOT EXISTS districts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code varchar(8) UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_ml text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_districts_name ON districts (name_en) WHERE deleted_at IS NULL;
