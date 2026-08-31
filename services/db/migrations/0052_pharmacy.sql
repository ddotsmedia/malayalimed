-- Pharmacy inventory.
CREATE TABLE IF NOT EXISTS medicine_inventory (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  medicine_id uuid REFERENCES medicines(id),
  pharmacy_id uuid,
  quantity int NOT NULL DEFAULT 0,
  reorder_level int NOT NULL DEFAULT 10,
  expiry_date date,
  last_updated timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_id uuid REFERENCES medicine_inventory(id),
  tx_type varchar(10) NOT NULL,
  qty int NOT NULL,
  reason varchar(100),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS inventory_alerts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_id uuid REFERENCES medicine_inventory(id),
  alert_type varchar(20),
  status varchar(20) NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_inventory_medicine ON medicine_inventory (medicine_id);
