CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_ref varchar(12) UNIQUE NOT NULL,
  doctor_id uuid NOT NULL REFERENCES doctors(id),
  patient_id uuid NOT NULL REFERENCES users(id),
  hospital_id uuid REFERENCES hospitals(id),
  slot_date date NOT NULL,
  slot_start time NOT NULL,
  slot_end time NOT NULL,
  mode text NOT NULL DEFAULT 'in_person',
  status text NOT NULL DEFAULT 'confirmed'
    CHECK (status IN ('confirmed','cancelled','completed','no_show')),
  notes text,
  fee int,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_appt_slot ON appointments (doctor_id, slot_date, slot_start) WHERE status='confirmed';
CREATE INDEX IF NOT EXISTS idx_appt_patient ON appointments (patient_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_appt_doctor ON appointments (doctor_id, slot_date) WHERE deleted_at IS NULL;
