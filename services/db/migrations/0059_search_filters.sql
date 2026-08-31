-- Doctor search filters (insurance) + today availability cache.
CREATE TABLE IF NOT EXISTS search_filters (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid UNIQUE REFERENCES doctors(id),
  languages text[],
  insurance_accepted text[],
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS availability_today (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid UNIQUE REFERENCES doctors(id),
  slot_count int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_availability_doctor ON availability_today (doctor_id);
