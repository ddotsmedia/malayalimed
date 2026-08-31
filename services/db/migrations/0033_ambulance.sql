CREATE TABLE IF NOT EXISTS ambulance_services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar(120) UNIQUE NOT NULL,
  name text NOT NULL, district_id uuid REFERENCES districts(id),
  phone text NOT NULL, service_type varchar(40) DEFAULT 'basic',
  is_24x7 boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_ambulance_district ON ambulance_services (district_id) WHERE deleted_at IS NULL;
INSERT INTO ambulance_services (slug, name, district_id, phone, service_type, is_24x7)
SELECT v.slug, v.name, d.id, v.phone, v.st, v.h FROM (VALUES
 ('gvk-108','GVK EMRI 108','EKM','108','emergency',true),
 ('kmcc-tvm','KMCC Ambulance','TVM','0471-2999999','basic',true),
 ('als-tsr','Life Line ALS','TSR','0487-2999999','advanced',true)
) AS v(slug,name,dcode,phone,st,h) JOIN districts d ON d.code=v.dcode
ON CONFLICT (slug) DO NOTHING;
