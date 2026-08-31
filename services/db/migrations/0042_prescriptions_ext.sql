-- Prescription upload (C3). Additive on existing prescriptions (0016).
ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS prescription_text text;
ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS file_url text;
ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS file_name varchar(255);
ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS medicines text[];
ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS expires_at timestamptz;

-- Refill requests.
CREATE TABLE IF NOT EXISTS prescription_refills (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  prescription_id uuid NOT NULL REFERENCES prescriptions(id),
  patient_id uuid NOT NULL REFERENCES users(id),
  status varchar(20) NOT NULL DEFAULT 'requested',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_refills_prescription ON prescription_refills (prescription_id);
