CREATE TABLE IF NOT EXISTS hospital_services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id uuid NOT NULL REFERENCES hospitals(id),
  name_en text NOT NULL,
  name_ml text,
  available_24x7 boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_services_hospital ON hospital_services (hospital_id) WHERE deleted_at IS NULL;
