-- Analytics tables + views.
CREATE TABLE IF NOT EXISTS analytics_daily (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric varchar(50) NOT NULL,
  value int NOT NULL DEFAULT 0,
  date date NOT NULL DEFAULT current_date
);
CREATE TABLE IF NOT EXISTS analytics_revenue (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES doctors(id),
  amount numeric(12,2) NOT NULL DEFAULT 0,
  date date NOT NULL DEFAULT current_date
);
CREATE OR REPLACE VIEW analytics_appointments AS
  SELECT (created_at)::date AS d, count(*)::int AS cnt FROM appointments WHERE deleted_at IS NULL GROUP BY 1;
CREATE OR REPLACE VIEW analytics_no_shows AS
  SELECT (created_at)::date AS d, count(*)::int AS cnt FROM appointments WHERE status='no_show' AND deleted_at IS NULL GROUP BY 1;
