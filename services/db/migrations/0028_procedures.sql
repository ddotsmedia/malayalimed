CREATE TABLE IF NOT EXISTS procedures (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar(120) UNIQUE NOT NULL,
  name_en text NOT NULL, name_ml text,
  category varchar(80), specialty_slug varchar(80),
  about_en text, preparation_en text, recovery_en text,
  typical_cost_inr integer,
  created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_procedures_cat ON procedures (category) WHERE deleted_at IS NULL;

INSERT INTO procedures (slug, name_en, name_ml, category, specialty_slug, about_en, preparation_en, recovery_en, typical_cost_inr) VALUES
 ('angioplasty','Angioplasty','ആൻജിയോപ്ലാസ്റ്റി','Cardiac','cardiology','A procedure to open blocked heart arteries using a balloon and stent.','Fasting for a few hours; blood tests beforehand.','Short hospital stay; avoid heavy lifting for a week.',150000),
 ('cataract-surgery','Cataract Surgery','തിമിര ശസ്ത്രക്രിയ','Ophthalmic','ophthalmology','Removal of a clouded lens and replacement with an artificial one.','Eye drops before surgery; arrange transport home.','Vision improves within days; use prescribed drops.',30000),
 ('knee-replacement','Knee Replacement','കാൽമുട്ട് മാറ്റിവയ്ക്കൽ','Orthopedic','orthopedics','Replacing a damaged knee joint with an implant.','Pre-op physiotherapy and fitness assessment.','Physiotherapy over several weeks; gradual walking.',200000),
 ('normal-delivery','Normal Delivery','സാധാരണ പ്രസവം','Obstetric','gynecology','Vaginal childbirth with monitoring and support.','Regular antenatal visits and birth planning.','Rest, nutrition, and newborn care support.',40000)
ON CONFLICT (slug) DO NOTHING;
