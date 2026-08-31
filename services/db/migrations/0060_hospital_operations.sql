-- Hospital operations: beds, departments, staff.
CREATE TABLE IF NOT EXISTS beds (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id uuid REFERENCES hospitals(id),
  bed_number varchar(50) NOT NULL,
  floor int,
  status varchar(20) NOT NULL DEFAULT 'vacant',
  patient_id uuid REFERENCES users(id),
  admitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id uuid REFERENCES hospitals(id),
  name varchar(100) NOT NULL,
  head_doctor_id uuid REFERENCES doctors(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS hospital_staff (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id uuid REFERENCES hospitals(id),
  user_id uuid REFERENCES users(id),
  role varchar(50),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_beds_hospital ON beds (hospital_id);
