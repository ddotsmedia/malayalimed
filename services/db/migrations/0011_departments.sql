CREATE TABLE IF NOT EXISTS hospital_departments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id uuid NOT NULL REFERENCES hospitals(id),
  name_en text NOT NULL,
  name_ml text,
  created_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_departments_hospital ON hospital_departments (hospital_id) WHERE deleted_at IS NULL;
