CREATE TABLE IF NOT EXISTS specialties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar(80) UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_ml text NOT NULL,
  icon text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_specialties_name ON specialties (name_en) WHERE deleted_at IS NULL;
