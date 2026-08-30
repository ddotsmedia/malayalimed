CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  role text NOT NULL DEFAULT 'patient'
    CHECK (role IN ('patient','doctor','hospital_admin','platform_admin')),
  full_name text,
  email text UNIQUE,
  mobile text UNIQUE,
  password_hash text,
  is_verified boolean NOT NULL DEFAULT false,
  locale text NOT NULL DEFAULT 'ml',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role) WHERE deleted_at IS NULL;
