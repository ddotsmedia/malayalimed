-- Batch 23: Telemedicine, Appointments, Patient Portal
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID,
  professional_id UUID REFERENCES professionals(id),
  hospital_id UUID REFERENCES hospitals(id),
  appointment_date DATE,
  appointment_time TIME,
  duration_minutes INT DEFAULT 30,
  appointment_type VARCHAR(50),
  consultation_mode VARCHAR(50),
  status VARCHAR(50) DEFAULT 'scheduled',
  reason_for_visit TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_appt_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appt_prof ON appointments(professional_id);
CREATE INDEX IF NOT EXISTS idx_appt_date_status ON appointments(appointment_date, status);

CREATE TABLE IF NOT EXISTS consultation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id),
  patient_id UUID,
  professional_id UUID REFERENCES professionals(id),
  video_room_id VARCHAR(255),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration_minutes INT,
  recording_url TEXT,
  session_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_session_appt ON consultation_sessions(appointment_id);
CREATE INDEX IF NOT EXISTS idx_session_prof ON consultation_sessions(professional_id);

CREATE TABLE IF NOT EXISTS health_vitals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID,
  vital_type VARCHAR(50),
  vital_value DECIMAL(8,2),
  unit VARCHAR(20),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  deleted_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_vitals_patient_type ON health_vitals(patient_id, vital_type);
CREATE INDEX IF NOT EXISTS idx_vitals_date ON health_vitals(recorded_at);

CREATE TABLE IF NOT EXISTS lab_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID,
  test_name VARCHAR(255),
  test_type VARCHAR(100),
  result_value DECIMAL(10,2),
  reference_range VARCHAR(100),
  status VARCHAR(50),
  test_date DATE,
  result_date DATE,
  lab_name VARCHAR(255),
  file_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_lab_patient ON lab_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_date ON lab_results(result_date);

CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID,
  professional_id UUID REFERENCES professionals(id),
  medication_name VARCHAR(255),
  dosage VARCHAR(100),
  frequency VARCHAR(100),
  duration_days INT,
  instructions TEXT,
  prescribed_date DATE,
  expiry_date DATE,
  refill_count INT DEFAULT 0,
  max_refills INT,
  prescription_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_rx_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_rx_date ON prescriptions(prescribed_date);

CREATE TABLE IF NOT EXISTS follow_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id),
  patient_id UUID,
  professional_id UUID REFERENCES professionals(id),
  followup_date DATE,
  followup_reason TEXT,
  status VARCHAR(50) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_followup_patient ON follow_ups(patient_id);
CREATE INDEX IF NOT EXISTS idx_followup_date ON follow_ups(followup_date);

CREATE TABLE IF NOT EXISTS health_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID,
  goal_name VARCHAR(255),
  goal_type VARCHAR(50),
  target_value DECIMAL(8,2),
  current_value DECIMAL(8,2),
  unit VARCHAR(20),
  deadline DATE,
  progress_percent INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_goals_patient ON health_goals(patient_id);

CREATE TABLE IF NOT EXISTS appointment_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id),
  patient_id UUID,
  reminder_time TIMESTAMP,
  reminder_type VARCHAR(50),
  is_sent BOOL DEFAULT false,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_reminders_appt ON appointment_reminders(appointment_id);
CREATE INDEX IF NOT EXISTS idx_reminders_sent ON appointment_reminders(is_sent);

-- Sample data seeding
INSERT INTO health_vitals (patient_id, vital_type, vital_value, unit, recorded_at)
SELECT
  '00000000-0000-0000-0000-000000000001'::uuid,
  'blood_pressure',
  120,
  'mmHg',
  CURRENT_TIMESTAMP - INTERVAL '1 day'
LIMIT 1 ON CONFLICT DO NOTHING;

INSERT INTO prescriptions (patient_id, professional_id, medication_name, dosage, frequency, duration_days, prescribed_date)
SELECT
  '00000000-0000-0000-0000-000000000001'::uuid,
  id,
  'Aspirin',
  '500mg',
  'Once daily',
  30,
  CURRENT_DATE
FROM professionals WHERE deleted_at IS NULL LIMIT 5 ON CONFLICT DO NOTHING;
