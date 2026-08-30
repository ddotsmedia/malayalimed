CREATE TABLE IF NOT EXISTS doctor_availability (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid NOT NULL REFERENCES doctors(id),
  day_of_week int NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  slot_minutes int NOT NULL DEFAULT 15,
  mode text NOT NULL DEFAULT 'in_person',
  created_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_availability_doctor ON doctor_availability (doctor_id) WHERE deleted_at IS NULL;
