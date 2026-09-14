-- Batch 21C: Search, Filters, Reviews, Bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  bookmark_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  UNIQUE(user_id, professional_id, hospital_id)
);
CREATE INDEX IF NOT EXISTS idx_bookmark_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmark_prof ON bookmarks(professional_id);
CREATE INDEX IF NOT EXISTS idx_bookmark_hosp ON bookmarks(hospital_id);

-- Populate sample bookmarks
INSERT INTO bookmarks (user_id, professional_id, bookmark_type, created_at)
SELECT NULL, p.id, 'favorite', CURRENT_TIMESTAMP FROM professionals p LIMIT 5 ON CONFLICT DO NOTHING;

INSERT INTO bookmarks (user_id, hospital_id, bookmark_type, created_at)
SELECT NULL, h.id, 'favorite', CURRENT_TIMESTAMP FROM hospitals h LIMIT 5 ON CONFLICT DO NOTHING;
