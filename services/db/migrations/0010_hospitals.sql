CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_ml text NOT NULL,
  district_id uuid REFERENCES districts(id),
  type text,
  address_en text,
  address_ml text,
  phone text,
  emergency_24x7 boolean NOT NULL DEFAULT false,
  bed_count int,
  logo_url text,
  about_en text,
  about_ml text,
  rating_avg numeric(2,1) DEFAULT 0,
  rating_count int DEFAULT 0,
  verification_status text NOT NULL DEFAULT 'pending',
  listing_status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_hospitals_district ON hospitals (district_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_hospitals_published ON hospitals (listing_status) WHERE deleted_at IS NULL;
