CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type text NOT NULL CHECK (entity_type IN ('doctor','hospital')),
  entity_id uuid NOT NULL,
  patient_id uuid NOT NULL REFERENCES users(id),
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text,
  body text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','flagged')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  deleted_at timestamptz,
  UNIQUE (entity_type, entity_id, patient_id)
);
CREATE INDEX IF NOT EXISTS idx_reviews_entity ON reviews (entity_type, entity_id) WHERE status='approved' AND deleted_at IS NULL;
