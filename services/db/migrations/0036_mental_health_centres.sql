CREATE TABLE IF NOT EXISTS mental_health_centres (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar(120) UNIQUE NOT NULL,
  name_en text NOT NULL, name_ml text, district_id uuid REFERENCES districts(id),
  address text, phone text, about_en text, services text[] DEFAULT '{}',
  crisis_phone text,
  created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_mhc_district ON mental_health_centres (district_id) WHERE deleted_at IS NULL;
INSERT INTO mental_health_centres (slug, name_en, name_ml, district_id, address, phone, about_en, services, crisis_phone)
SELECT v.slug, v.en, v.ml, d.id, v.addr, v.phone, v.about, v.svc, v.crisis FROM (VALUES
 ('mind-ekm','Mind Wellness Centre','മൈൻഡ് വെൽനെസ്','EKM','Panampilly Nagar, Ernakulam','0484-2601234','Counselling, therapy, and psychiatry.','{Counselling,Therapy,Psychiatry}'::text[],'1056'),
 ('sneha-tvm','Sneha Support Centre','സ്നേഹ','TVM','Thiruvananthapuram','0471-2601234','Emotional support and suicide prevention.','{Helpline,Counselling}'::text[],'0471-2552056')
) AS v(slug,en,ml,dcode,addr,phone,about,svc,crisis) JOIN districts d ON d.code=v.dcode
ON CONFLICT (slug) DO NOTHING;
