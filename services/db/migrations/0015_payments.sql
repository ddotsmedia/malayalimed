CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id uuid REFERENCES appointments(id),
  patient_id uuid NOT NULL REFERENCES users(id),
  amount_inr int NOT NULL,
  method text,
  status text NOT NULL DEFAULT 'created'
    CHECK (status IN ('created','pending','paid','failed','refunded')),
  gateway_ref text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_payments_patient ON payments (patient_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_payments_appt ON payments (appointment_id);
