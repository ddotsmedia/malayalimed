-- Health Tracker (C1). New tables.
CREATE TABLE IF NOT EXISTS health_metrics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid NOT NULL REFERENCES users(id),
  metric_type varchar(50) NOT NULL,
  value numeric(10,2),
  value2 numeric(10,2),            -- e.g. diastolic for blood_pressure
  unit varchar(20),
  recorded_date date NOT NULL DEFAULT current_date,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (patient_id, metric_type, recorded_date)
);
CREATE INDEX IF NOT EXISTS idx_metrics_patient ON health_metrics (patient_id);
CREATE INDEX IF NOT EXISTS idx_metrics_date ON health_metrics (recorded_date);

CREATE TABLE IF NOT EXISTS health_goals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid NOT NULL REFERENCES users(id),
  goal_type varchar(50) NOT NULL,
  target_value numeric(10,2),
  current_value numeric(10,2) DEFAULT 0,
  unit varchar(20),
  status varchar(20) NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_goals_patient ON health_goals (patient_id) WHERE status='active';
