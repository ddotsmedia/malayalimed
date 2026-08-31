-- Doctor self-registration (F2). New table.
CREATE TABLE IF NOT EXISTS doctor_registrations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  doctor_id uuid REFERENCES doctors(id),
  email varchar(255) NOT NULL,
  phone varchar(20) NOT NULL,
  display_name varchar(255) NOT NULL,
  reg_no varchar(100) NOT NULL,
  specialty_id uuid REFERENCES specialties(id),
  district_id uuid REFERENCES districts(id),
  years_experience integer,
  consultation_fee integer,
  about text,
  education_json jsonb,
  status varchar(50) NOT NULL DEFAULT 'submitted',
  nmc_verified boolean DEFAULT false,
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz DEFAULT now(),
  CONSTRAINT unique_reg_no UNIQUE (reg_no)
);
CREATE INDEX IF NOT EXISTS idx_doctor_reg_status ON doctor_registrations (status, created_at DESC);
