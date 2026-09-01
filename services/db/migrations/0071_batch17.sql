-- Batch 17: AI scribe, IoMT, conditions, DTx, ABDM, insurance, Rx delivery, CDS, behavioral, compliance.
CREATE TABLE IF NOT EXISTS scribe_sessions (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), doctor_id uuid REFERENCES doctors(id), appointment_id uuid REFERENCES appointments(id), audio_url text, transcription text, notes_draft text, notes_final text, signed_at timestamptz, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS scribe_templates (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), doctor_id uuid REFERENCES doctors(id), template_name varchar(100), section_types text[], created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS drug_interactions (drug1 varchar(100), drug2 varchar(100), severity varchar(20), description text, PRIMARY KEY (drug1, drug2));
CREATE INDEX IF NOT EXISTS idx_scribe_doc ON scribe_sessions(doctor_id);

CREATE TABLE IF NOT EXISTS iot_devices (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), patient_id uuid REFERENCES users(id), device_type varchar(50), device_name varchar(100), auth_token text, threshold_low numeric(10,2), threshold_high numeric(10,2), last_sync timestamptz, is_active boolean DEFAULT true, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS device_metrics (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), device_id uuid REFERENCES iot_devices(id), metric_type varchar(50), value numeric(12,2), unit varchar(20), recorded_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS vital_alerts (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), patient_id uuid REFERENCES users(id), alert_type varchar(50), value numeric(12,2), threshold numeric(12,2), severity varchar(20), acknowledged boolean DEFAULT false, created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_device_patient ON iot_devices(patient_id);
CREATE INDEX IF NOT EXISTS idx_metrics_device ON device_metrics(device_id);
CREATE INDEX IF NOT EXISTS idx_alerts_patient ON vital_alerts(patient_id);

CREATE TABLE IF NOT EXISTS patient_conditions (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), patient_id uuid REFERENCES users(id), condition_name varchar(100), icd10_code varchar(10), diagnosis_date date, status varchar(20) DEFAULT 'active', created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS condition_medications (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), condition_id uuid REFERENCES patient_conditions(id), medication_name varchar(100), dosage varchar(50), frequency varchar(50), start_date date, end_date date);
CREATE TABLE IF NOT EXISTS condition_labs (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), condition_id uuid REFERENCES patient_conditions(id), lab_name varchar(100), target_value numeric(12,2), last_value numeric(12,2), last_test_date date, next_due_date date);
CREATE INDEX IF NOT EXISTS idx_conditions_patient ON patient_conditions(patient_id);

CREATE TABLE IF NOT EXISTS dtx_programs (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), name varchar(100), condition varchar(100), duration_weeks int, modules int, description text);
CREATE TABLE IF NOT EXISTS dtx_enrollment (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), patient_id uuid REFERENCES users(id), program_id uuid REFERENCES dtx_programs(id), status varchar(20) DEFAULT 'active', started_at timestamptz DEFAULT now(), completed_at timestamptz);
CREATE TABLE IF NOT EXISTS dtx_modules (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), program_id uuid REFERENCES dtx_programs(id), module_num int, title varchar(100), content_url text, video_url text);
CREATE TABLE IF NOT EXISTS dtx_completion (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), enrollment_id uuid REFERENCES dtx_enrollment(id), module_id uuid REFERENCES dtx_modules(id), completed_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_dtx_patient ON dtx_enrollment(patient_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_dtx_enroll_unique ON dtx_enrollment(patient_id, program_id);

CREATE TABLE IF NOT EXISTS abdm_accounts (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), patient_id uuid REFERENCES users(id), abha_id varchar(20), abha_number varchar(20), auth_token text, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS abdm_consents (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), patient_id uuid REFERENCES users(id), provider_id uuid, consent_type varchar(50), status varchar(20) DEFAULT 'active', valid_until timestamptz, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS abdm_health_records (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), patient_id uuid REFERENCES users(id), record_type varchar(50), fhir_bundle jsonb, shared_providers text[], created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_abdm_patient ON abdm_accounts(patient_id);

CREATE TABLE IF NOT EXISTS patient_insurance (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), patient_id uuid REFERENCES users(id), insurer_name varchar(100), policy_number varchar(100), plan_name varchar(100), copay numeric(12,2), deductible numeric(12,2), coverage_limit numeric(12,2), active boolean DEFAULT true, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS prior_auth_requests (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), doctor_id uuid REFERENCES doctors(id), patient_id uuid REFERENCES users(id), service_type varchar(100), status varchar(20) DEFAULT 'submitted', insurer_response jsonb, created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_insurance_patient ON patient_insurance(patient_id);

CREATE TABLE IF NOT EXISTS prescription_orders (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), prescription_id uuid REFERENCES prescriptions(id), patient_id uuid REFERENCES users(id), pharmacy_id uuid, delivery_address text, status varchar(20) DEFAULT 'placed', delivered_at timestamptz, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS pharmacy_subscriptions (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), patient_id uuid REFERENCES users(id), subscription_type varchar(20), start_date date DEFAULT current_date, next_refill_date date, auto_refill boolean DEFAULT true, discount_percent numeric(5,2) DEFAULT 0);
CREATE INDEX IF NOT EXISTS idx_orders_patient ON prescription_orders(patient_id);

CREATE TABLE IF NOT EXISTS diagnosis_suggestions (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), encounter_id uuid, symptoms text[], suggested_diagnoses jsonb, user_accepted boolean, final_diagnosis varchar(100), created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS lab_interpretations (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), lab_result_id uuid, ai_interpretation text, doctor_review_notes text, approved_by_doctor boolean DEFAULT false, created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_diagnosis_encounter ON diagnosis_suggestions(encounter_id);

CREATE TABLE IF NOT EXISTS therapist_profiles (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), user_id uuid REFERENCES users(id), name varchar(120), specialization text[], license_number varchar(100), insurance_accepted text[], hourly_rate numeric(12,2), bio text, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS therapy_sessions (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), patient_id uuid REFERENCES users(id), therapist_id uuid REFERENCES therapist_profiles(id), session_type varchar(50), notes text, next_session_date date, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS support_groups (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), name varchar(120), condition varchar(100), facilitator_id uuid, meeting_time time, meeting_day varchar(20), members int DEFAULT 0);
CREATE INDEX IF NOT EXISTS idx_therapist_spec ON therapist_profiles USING GIN(specialization);

CREATE TABLE IF NOT EXISTS audit_log_extended (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), action varchar(100), actor_id uuid, resource_type varchar(50), resource_id uuid, details jsonb, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS dpdp_requests (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), user_id uuid REFERENCES users(id), request_type varchar(50), status varchar(20) DEFAULT 'pending', responded_at timestamptz, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS device_registrations (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), device_type varchar(100), registration_number varchar(100), dcgi_approved boolean DEFAULT false, created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_log_extended(actor_id);

-- Seeds.
INSERT INTO dtx_programs (name, condition, duration_weeks, modules, description) VALUES
  ('Diabetes Control', 'diabetes', 12, 12, '12-week structured diabetes management'),
  ('Hypertension Wellness', 'hypertension', 8, 8, '8-week BP control program'),
  ('Mental Health Navigator', 'anxiety', 10, 10, '10-week anxiety reduction program'),
  ('Weight Loss Journey', 'obesity', 16, 16, '16-week weight management program'),
  ('Long COVID Recovery', 'long_covid', 12, 12, '12-week post-COVID rehab')
ON CONFLICT DO NOTHING;
INSERT INTO drug_interactions (drug1, drug2, severity, description) VALUES
  ('warfarin', 'aspirin', 'high', 'Increased bleeding risk when combined.'),
  ('metformin', 'alcohol', 'moderate', 'Raises risk of lactic acidosis.'),
  ('lisinopril', 'potassium', 'high', 'Risk of hyperkalemia.'),
  ('simvastatin', 'clarithromycin', 'high', 'Increased risk of myopathy/rhabdomyolysis.'),
  ('ibuprofen', 'lisinopril', 'moderate', 'NSAIDs can reduce antihypertensive effect and affect kidney function.')
ON CONFLICT DO NOTHING;
