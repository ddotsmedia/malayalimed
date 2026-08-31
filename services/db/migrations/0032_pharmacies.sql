CREATE TABLE IF NOT EXISTS pharmacies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar(120) UNIQUE NOT NULL,
  name text NOT NULL, district_id uuid REFERENCES districts(id),
  phone text, address text,
  is_24x7 boolean NOT NULL DEFAULT false, home_delivery boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_pharmacies_district ON pharmacies (district_id) WHERE deleted_at IS NULL;
INSERT INTO pharmacies (slug, name, district_id, phone, address, is_24x7, home_delivery)
SELECT v.slug, v.name, d.id, v.phone, v.addr, v.h, v.del FROM (VALUES
 ('apollo-ekm','Apollo Pharmacy','EKM','0484-2345678','MG Road, Ernakulam',true,true),
 ('medplus-tvm','MedPlus','TVM','0471-2345678','Pattom, Thiruvananthapuram',false,true),
 ('care-tsr','Care Pharmacy','TSR','0487-2345678','Round South, Thrissur',true,false)
) AS v(slug,name,dcode,phone,addr,h,del) JOIN districts d ON d.code=v.dcode
ON CONFLICT (slug) DO NOTHING;
