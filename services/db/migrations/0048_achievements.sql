-- Gamification badges (F4). New table.
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid NOT NULL REFERENCES users(id),
  badge_type varchar(50) NOT NULL,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_badge UNIQUE (patient_id, badge_type)
);
CREATE INDEX IF NOT EXISTS idx_achievements_patient ON achievements (patient_id);
