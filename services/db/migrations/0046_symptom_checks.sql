-- Smart Symptom Checker (F1). New table.
CREATE TABLE IF NOT EXISTS symptom_checks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES users(id),
  symptoms text[],
  ai_result jsonb,
  source varchar(10) DEFAULT 'rules',
  clicked_doctor boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_symptom_checks_patient ON symptom_checks (patient_id, created_at DESC);
