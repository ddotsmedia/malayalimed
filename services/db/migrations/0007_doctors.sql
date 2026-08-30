CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  slug text UNIQUE NOT NULL,
  display_name text NOT NULL,
  specialty_id uuid REFERENCES specialties(id),
  district_id uuid REFERENCES districts(id),
  reg_no text,
  qualifications text,
  years_experience int,
  consultation_fee int,
  photo_url text,
  about_en text,
  about_ml text,
  languages text[] DEFAULT '{}',
  consultation_modes text[] DEFAULT '{in_person}',
  rating_avg numeric(2,1) DEFAULT 0,
  rating_count int DEFAULT 0,
  verification_status text NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending','verified','rejected')),
  listing_status text NOT NULL DEFAULT 'draft'
    CHECK (listing_status IN ('draft','published','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors (specialty_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_doctors_district ON doctors (district_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_doctors_published ON doctors (listing_status) WHERE deleted_at IS NULL;
