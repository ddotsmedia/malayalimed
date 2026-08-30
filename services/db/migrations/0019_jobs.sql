CREATE TABLE IF NOT EXISTS job_listings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  employer text NOT NULL,
  district_id uuid REFERENCES districts(id),
  specialty_id uuid REFERENCES specialties(id),
  job_type text DEFAULT 'full_time',
  salary_min int,
  salary_max int,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','closed','draft')),
  posted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON job_listings (status, posted_at DESC) WHERE deleted_at IS NULL;
