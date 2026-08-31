-- Encounter notes + line-item prescriptions (prescriptions table exists at 0016;
-- use encounter_prescriptions for structured line items).
CREATE TABLE IF NOT EXISTS encounter_notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id uuid REFERENCES appointments(id),
  doctor_id uuid REFERENCES doctors(id),
  patient_id uuid REFERENCES users(id),
  notes text,
  diagnosis text,
  treatment_plan text,
  follow_up_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS encounter_prescriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  encounter_id uuid REFERENCES encounter_notes(id),
  medicine_id uuid REFERENCES medicines(id),
  medicine_name varchar(200),
  dosage varchar(100),
  frequency varchar(50),
  duration int,
  instructions text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notes_appointment ON encounter_notes (appointment_id);
