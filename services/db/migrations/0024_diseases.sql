CREATE TABLE IF NOT EXISTS diseases (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar(120) UNIQUE NOT NULL,
  name_en text NOT NULL, name_ml text,
  category varchar(80),
  overview_en text, overview_ml text,
  symptoms_en text, prevention_en text,
  specialty_slug varchar(80),
  created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_diseases_cat ON diseases (category) WHERE deleted_at IS NULL;

INSERT INTO diseases (slug, name_en, name_ml, category, overview_en, symptoms_en, prevention_en, specialty_slug) VALUES
 ('dengue','Dengue Fever','ഡെങ്കിപ്പനി','Infectious','A mosquito-borne viral infection common in the monsoon.','High fever, severe headache, joint and muscle pain, rash.','Prevent mosquito breeding; use repellents and nets.','general-physician'),
 ('diabetes','Diabetes (Type 2)','പ്രമേഹം','Metabolic','A chronic condition where blood sugar is too high.','Increased thirst, frequent urination, fatigue, slow healing.','Healthy diet, regular exercise, weight control.','general-physician'),
 ('hypertension','Hypertension','രക്തസമ്മർദ്ദം','Cardiac','Persistently high blood pressure that strains the heart.','Often none; sometimes headache or dizziness.','Low-salt diet, exercise, limit alcohol, manage stress.','cardiology'),
 ('asthma','Asthma','ആസ്ത്മ','Respiratory','A condition where airways narrow and swell.','Wheezing, breathlessness, chest tightness, cough.','Avoid triggers; follow the prescribed inhaler plan.','general-physician'),
 ('migraine','Migraine','മൈഗ്രെയ്ൻ','Neurological','A recurring, often one-sided severe headache.','Throbbing pain, nausea, sensitivity to light and sound.','Identify triggers, regular sleep, stay hydrated.','neurology')
ON CONFLICT (slug) DO NOTHING;
