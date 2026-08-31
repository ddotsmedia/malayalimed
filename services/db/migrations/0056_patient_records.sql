-- Patient medical history, allergies, chronic conditions.
CREATE TABLE IF NOT EXISTS patient_medical_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES users(id),
  record_type varchar(50),
  title varchar(200),
  data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS allergies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES users(id),
  allergen varchar(200) NOT NULL,
  reaction text,
  severity varchar(20) DEFAULT 'mild',
  created_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE TABLE IF NOT EXISTS chronic_conditions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES users(id),
  condition varchar(100) NOT NULL,
  diagnosed_date date,
  status varchar(20) DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_history_patient ON patient_medical_history (patient_id);
CREATE INDEX IF NOT EXISTS idx_allergies_patient ON allergies (patient_id);
