CREATE TABLE IF NOT EXISTS eye_hospitals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar(120) UNIQUE NOT NULL,
  name_en text NOT NULL, name_ml text, district_id uuid REFERENCES districts(id),
  address text, phone text, about_en text, services text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_eye_district ON eye_hospitals (district_id) WHERE deleted_at IS NULL;
INSERT INTO eye_hospitals (slug, name_en, name_ml, district_id, address, phone, about_en, services)
SELECT v.slug, v.en, v.ml, d.id, v.addr, v.phone, v.about, v.svc FROM (VALUES
 ('vision-ekm','Vision Eye Hospital','വിഷൻ ഐ ഹോസ്പിറ്റൽ','EKM','Edappally, Ernakulam','0484-2501234','Comprehensive eye care and surgery.','{Cataract,LASIK,Glaucoma,Retina}'::text[]),
 ('drishti-kkd','Drishti Eye Care','ദൃഷ്ടി ഐ കെയർ','KKD','Mavoor Road, Kozhikode','0495-2501234','Advanced ophthalmology centre.','{Cataract,Squint,Cornea}'::text[])
) AS v(slug,en,ml,dcode,addr,phone,about,svc) JOIN districts d ON d.code=v.dcode
ON CONFLICT (slug) DO NOTHING;
