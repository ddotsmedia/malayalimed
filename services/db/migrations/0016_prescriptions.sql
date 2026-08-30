CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id uuid REFERENCES appointments(id),
  doctor_id uuid REFERENCES doctors(id),
  patient_id uuid NOT NULL REFERENCES users(id),
  medications jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  issued_at date DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions (patient_id) WHERE deleted_at IS NULL;
