CREATE TABLE IF NOT EXISTS dental_clinics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar(120) UNIQUE NOT NULL,
  name_en text NOT NULL, name_ml text, district_id uuid REFERENCES districts(id),
  address text, phone text, about_en text, services text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_dental_district ON dental_clinics (district_id) WHERE deleted_at IS NULL;
INSERT INTO dental_clinics (slug, name_en, name_ml, district_id, address, phone, about_en, services)
SELECT v.slug, v.en, v.ml, d.id, v.addr, v.phone, v.about, v.svc FROM (VALUES
 ('smile-ekm','Smile Dental Care','സ്മൈൽ ഡെന്റൽ','EKM','Kaloor, Ernakulam','0484-2401234','Family dental clinic with modern equipment.','{Cleaning,Fillings,Root Canal,Braces}'::text[]),
 ('bright-tvm','Bright Dental Clinic','ബ്രൈറ്റ് ഡെന്റൽ','TVM','Kowdiar, Thiruvananthapuram','0471-2401234','Cosmetic and general dentistry.','{Whitening,Implants,Extraction}'::text[])
) AS v(slug,en,ml,dcode,addr,phone,about,svc) JOIN districts d ON d.code=v.dcode
ON CONFLICT (slug) DO NOTHING;
