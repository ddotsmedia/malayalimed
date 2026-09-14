-- Batch 22: Jobs, Gigs, Locums, Shifts, Recruiter Analytics
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id),
  position_title VARCHAR(255),
  position_type VARCHAR(50),
  specialization VARCHAR(100),
  experience_required INT,
  salary_min INT,
  salary_max INT,
  description TEXT,
  location_district VARCHAR(100),
  job_status VARCHAR(50) DEFAULT 'open',
  posted_by UUID,
  posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_jobs_hospital ON jobs(hospital_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status_district ON jobs(job_status, location_district);

CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id),
  professional_id UUID REFERENCES professionals(id),
  application_status VARCHAR(50) DEFAULT 'pending',
  resume_url TEXT,
  cover_letter TEXT,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_job_apps_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_apps_prof ON job_applications(professional_id);

CREATE TABLE IF NOT EXISTS gigs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id),
  gig_title VARCHAR(255),
  position_type VARCHAR(50),
  specialization VARCHAR(100),
  duration_days INT,
  hourly_rate DECIMAL(8,2),
  start_date DATE,
  end_date DATE,
  location_district VARCHAR(100),
  gig_status VARCHAR(50) DEFAULT 'open',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_gigs_hospital ON gigs(hospital_id);
CREATE INDEX IF NOT EXISTS idx_gigs_status_district ON gigs(gig_status, location_district);

CREATE TABLE IF NOT EXISTS gig_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gig_id UUID REFERENCES gigs(id),
  professional_id UUID REFERENCES professionals(id),
  booking_status VARCHAR(50) DEFAULT 'pending',
  booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP,
  deleted_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_gig_bookings_gig ON gig_bookings(gig_id);
CREATE INDEX IF NOT EXISTS idx_gig_bookings_prof ON gig_bookings(professional_id);

CREATE TABLE IF NOT EXISTS locum_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id),
  professional_id UUID REFERENCES professionals(id),
  specialty VARCHAR(100),
  start_date DATE,
  end_date DATE,
  shift_pattern VARCHAR(50),
  daily_rate DECIMAL(8,2),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_locum_hospital ON locum_assignments(hospital_id);
CREATE INDEX IF NOT EXISTS idx_locum_prof ON locum_assignments(professional_id);

CREATE TABLE IF NOT EXISTS shift_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id),
  shift_date DATE,
  shift_type VARCHAR(50),
  specialty VARCHAR(100),
  required_staff INT,
  filled_staff INT DEFAULT 0,
  slot_status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_shifts_hospital ON shift_slots(hospital_id);
CREATE INDEX IF NOT EXISTS idx_shifts_date_status ON shift_slots(shift_date, slot_status);

CREATE TABLE IF NOT EXISTS job_matching_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id),
  professional_id UUID REFERENCES professionals(id),
  match_score DECIMAL(3,2),
  match_reasons TEXT[],
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_matching_job ON job_matching_scores(job_id);

CREATE TABLE IF NOT EXISTS job_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES professionals(id),
  specialty VARCHAR(100),
  min_salary INT,
  preferred_district VARCHAR(100),
  alert_active BOOL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_alerts_prof ON job_alerts(professional_id);

CREATE TABLE IF NOT EXISTS recruiter_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id),
  recruiter_id UUID,
  jobs_posted INT DEFAULT 0,
  applications_received INT DEFAULT 0,
  positions_filled INT DEFAULT 0,
  time_to_hire INT,
  average_candidate_rating DECIMAL(3,2),
  reporting_period VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_analytics_hospital ON recruiter_analytics(hospital_id);

-- Sample data seeding
INSERT INTO jobs (hospital_id, position_title, position_type, specialization, experience_required, salary_min, salary_max, location_district, job_status)
SELECT id, 'Senior Cardiologist', 'permanent', 'Cardiology', 5, 100000, 150000, district, 'open' FROM hospitals WHERE deleted_at IS NULL LIMIT 5 ON CONFLICT DO NOTHING;

INSERT INTO jobs (hospital_id, position_title, position_type, specialization, experience_required, salary_min, salary_max, location_district, job_status)
SELECT id, 'Orthopedic Surgeon', 'permanent', 'Orthopedics', 3, 80000, 120000, district, 'open' FROM hospitals WHERE deleted_at IS NULL LIMIT 5 ON CONFLICT DO NOTHING;

INSERT INTO gigs (hospital_id, gig_title, position_type, specialization, duration_days, hourly_rate, start_date, end_date, location_district, gig_status)
SELECT id, 'Temporary Doctor', 'contract', 'General Practice', 5, 2000, CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '12 days', district, 'open' FROM hospitals WHERE deleted_at IS NULL LIMIT 5 ON CONFLICT DO NOTHING;

INSERT INTO shift_slots (hospital_id, shift_date, shift_type, specialty, required_staff, slot_status)
SELECT id, CURRENT_DATE + INTERVAL '1 day', 'morning', 'General Practice', 3, 'open' FROM hospitals WHERE deleted_at IS NULL LIMIT 5 ON CONFLICT DO NOTHING;
