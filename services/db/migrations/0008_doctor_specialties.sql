CREATE TABLE IF NOT EXISTS doctor_specialties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid NOT NULL REFERENCES doctors(id),
  specialty_id uuid NOT NULL REFERENCES specialties(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (doctor_id, specialty_id)
);
