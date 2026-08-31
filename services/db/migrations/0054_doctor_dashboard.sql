-- Doctor schedule + earnings.
CREATE TABLE IF NOT EXISTS doctor_schedule (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES doctors(id),
  day_of_week int,
  start_time time,
  end_time time,
  slot_duration int DEFAULT 15
);
CREATE TABLE IF NOT EXISTS doctor_earnings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES doctors(id),
  appointment_id uuid REFERENCES appointments(id),
  amount numeric(12,2) NOT NULL DEFAULT 0,
  status varchar(20) NOT NULL DEFAULT 'pending',
  earned_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_doc_earnings_doctor ON doctor_earnings (doctor_id);
