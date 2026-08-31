-- Additive on the existing reviews table (0014). No new reviews table.
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS helpful_count integer NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_reviews_entity_approved ON reviews (entity_type, entity_id)
  WHERE status='approved' AND deleted_at IS NULL;
