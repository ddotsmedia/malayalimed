-- Lab orders + results (no FK on test ids to avoid table-name ambiguity).
CREATE TABLE IF NOT EXISTS lab_orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES users(id),
  doctor_id uuid REFERENCES doctors(id),
  test_ids uuid[],
  test_names text[],
  status varchar(20) NOT NULL DEFAULT 'ordered',
  order_date timestamptz NOT NULL DEFAULT now(),
  completed_date timestamptz
);
CREATE TABLE IF NOT EXISTS lab_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES lab_orders(id),
  test_id uuid,
  test_name varchar(200),
  result_value varchar(200),
  normal_range varchar(100),
  pdf_url text,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lab_orders_patient ON lab_orders (patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_order ON lab_results (order_id);
