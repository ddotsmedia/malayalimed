-- Batch 18: advanced jobs portal. job_listings exists (0019/0043) — extend additively.
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS employer_id uuid REFERENCES users(id);
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS location varchar(100);
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS remote_allowed boolean DEFAULT false;
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS expires_at timestamptz;
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS specialty varchar(100);
CREATE TABLE IF NOT EXISTS job_requirements (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), job_id uuid REFERENCES job_listings(id), requirement text);
CREATE INDEX IF NOT EXISTS idx_job_employer ON job_listings(employer_id);

CREATE TABLE IF NOT EXISTS job_filters (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), user_id uuid REFERENCES users(id), name varchar(100), specialties text[], salary_min numeric(12,2), salary_max numeric(12,2), job_types text[], remote_only boolean, locations text[], created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS search_history (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), user_id uuid REFERENCES users(id), query varchar(200), filters jsonb, results_count int, created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_filters_user ON job_filters(user_id);

CREATE TABLE IF NOT EXISTS job_applications (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), job_id uuid REFERENCES job_listings(id), candidate_id uuid REFERENCES users(id), resume_id uuid, cover_note text, status varchar(20) DEFAULT 'applied', applied_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS application_pipeline (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), application_id uuid REFERENCES job_applications(id), stage varchar(50), moved_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_app_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_app_candidate ON job_applications(candidate_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_app_unique ON job_applications(job_id, candidate_id);

CREATE TABLE IF NOT EXISTS job_alerts (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), user_id uuid REFERENCES users(id), filter_id uuid REFERENCES job_filters(id), frequency varchar(20) DEFAULT 'daily', is_active boolean DEFAULT true, last_sent_at timestamptz, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS alert_notifications (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), alert_id uuid REFERENCES job_alerts(id), job_id uuid REFERENCES job_listings(id), sent_at timestamptz DEFAULT now(), opened_at timestamptz);
CREATE INDEX IF NOT EXISTS idx_alert_user ON job_alerts(user_id);

CREATE TABLE IF NOT EXISTS resume_templates (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), name varchar(100), sections text[], layout varchar(50));
CREATE TABLE IF NOT EXISTS user_resumes (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), user_id uuid REFERENCES users(id), template_id uuid REFERENCES resume_templates(id), title varchar(100), full_name varchar(100), email varchar(100), phone varchar(20), summary text, data jsonb, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_resume_user ON user_resumes(user_id);

CREATE TABLE IF NOT EXISTS candidate_profiles (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), user_id uuid UNIQUE REFERENCES users(id), headline varchar(200), summary text, specialties text[], experience_years int, current_role_title varchar(100), preferred_locations text[], preferred_job_types text[], willing_to_relocate boolean, salary_expectations_min numeric(12,2), salary_expectations_max numeric(12,2), is_verified boolean DEFAULT false, visibility varchar(20) DEFAULT 'public', skills text[], created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_candidate_user ON candidate_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_candidate_spec ON candidate_profiles USING GIN(specialties);

CREATE TABLE IF NOT EXISTS recruiter_profiles (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), user_id uuid UNIQUE REFERENCES users(id), company_name varchar(200), company_size varchar(50), industry varchar(100), description text, verified boolean DEFAULT false, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS saved_candidates (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), recruiter_id uuid REFERENCES users(id), candidate_id uuid REFERENCES users(id), saved_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS job_views (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), job_id uuid REFERENCES job_listings(id), viewer_id uuid, viewed_at timestamptz DEFAULT now());
CREATE UNIQUE INDEX IF NOT EXISTS idx_saved_cand_unique ON saved_candidates(recruiter_id, candidate_id);

CREATE TABLE IF NOT EXISTS interview_slots (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), application_id uuid REFERENCES job_applications(id), proposed_date date, proposed_time time, duration_minutes int DEFAULT 30, status varchar(20) DEFAULT 'proposed');
CREATE TABLE IF NOT EXISTS job_offers (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), application_id uuid REFERENCES job_applications(id), offer_text text, salary_offered numeric(12,2), issued_at timestamptz DEFAULT now(), expires_at timestamptz, status varchar(20) DEFAULT 'sent');
CREATE INDEX IF NOT EXISTS idx_slots_app ON interview_slots(application_id);
CREATE INDEX IF NOT EXISTS idx_offer_app ON job_offers(application_id);

CREATE TABLE IF NOT EXISTS salary_data (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), specialty varchar(100), role varchar(100), location varchar(100), experience_level varchar(50), salary_min numeric(12,2), salary_max numeric(12,2), salary_median numeric(12,2), data_points int, year int);
CREATE TABLE IF NOT EXISTS salary_reports (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), requester_id uuid, specialty varchar(100), location varchar(100), generated_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_salary_spec ON salary_data(specialty);

CREATE TABLE IF NOT EXISTS job_analytics (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), job_id uuid REFERENCES job_listings(id), views int DEFAULT 0, applications int DEFAULT 0, saved_count int DEFAULT 0, conversion_rate numeric(6,2), last_updated timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS recruiter_analytics (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), recruiter_id uuid REFERENCES users(id), jobs_posted int DEFAULT 0, total_views int DEFAULT 0, total_applications int DEFAULT 0, hires_closed int DEFAULT 0, revenue_generated numeric(12,2) DEFAULT 0);
CREATE TABLE IF NOT EXISTS audit_jobs (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), action varchar(50), actor_id uuid, resource_id uuid, details jsonb, created_at timestamptz DEFAULT now());

-- Seeds.
INSERT INTO resume_templates (name, sections, layout) VALUES
  ('Professional', ARRAY['summary','experience','education','skills'], 'modern'),
  ('Academic', ARRAY['education','skills','experience','publications'], 'traditional'),
  ('Executive', ARRAY['summary','experience','achievements','education'], 'executive')
ON CONFLICT DO NOTHING;
INSERT INTO salary_data (specialty, role, location, experience_level, salary_min, salary_max, salary_median, data_points, year) VALUES
  ('General Practice','Doctor','Kochi','0-2',300000,500000,400000,45,2026),
  ('General Practice','Doctor','Kochi','3-5',500000,800000,650000,38,2026),
  ('Cardiology','Doctor','Kochi','0-2',600000,1000000,800000,22,2026),
  ('Cardiology','Doctor','Kochi','3-5',1000000,1500000,1200000,18,2026),
  ('Nursing','Nurse','Kochi','0-2',150000,250000,200000,60,2026),
  ('Nursing','Nurse','Kochi','3-5',250000,400000,325000,55,2026)
ON CONFLICT DO NOTHING;
