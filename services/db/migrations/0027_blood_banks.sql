CREATE TABLE IF NOT EXISTS blood_banks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar(120) UNIQUE NOT NULL,
  name text NOT NULL, district_id uuid REFERENCES districts(id),
  phone text, address text,
  available_types text[] DEFAULT '{}',
  is_24x7 boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_blood_banks_district ON blood_banks (district_id) WHERE deleted_at IS NULL;

INSERT INTO blood_banks (slug, name, district_id, phone, address, available_types, is_24x7)
SELECT v.slug, v.name, d.id, v.phone, v.address, v.types, v.h
FROM (VALUES
 ('gh-ekm-blood','General Hospital Blood Bank','EKM','0484-2360002','Ernakulam','{A+,B+,O+,AB+,O-}'::text[],true),
 ('medical-college-tvm','Medical College Blood Bank','TVM','0471-2528300','Thiruvananthapuram','{A+,B+,O+,AB+,A-,B-}'::text[],true),
 ('district-tsr','District Hospital Blood Bank','TSR','0487-2333100','Thrissur','{A+,B+,O+,O-}'::text[],false)
) AS v(slug,name,dcode,phone,address,types,h)
JOIN districts d ON d.code=v.dcode
ON CONFLICT (slug) DO NOTHING;
