-- Auth improvements. Additive.
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified boolean NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified boolean NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS ip_address varchar(45);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users (email_verified) WHERE deleted_at IS NULL;
