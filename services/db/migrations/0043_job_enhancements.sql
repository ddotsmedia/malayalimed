-- Advanced job search (B1). Additive; salary_min/max already exist (0019).
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS experience_level varchar(50);
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS work_mode varchar(50) DEFAULT 'on-site';
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS employment_type varchar(50) DEFAULT 'full-time';
CREATE INDEX IF NOT EXISTS idx_jobs_salary ON job_listings (salary_min, salary_max);
CREATE INDEX IF NOT EXISTS idx_jobs_experience ON job_listings (experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_mode ON job_listings (work_mode);
