-- Ported/adapted from khp 0045/0087: standalone lab-test guide (no lab FK). Additive.
CREATE TABLE IF NOT EXISTS lab_tests_guide (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar(120) UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_ml text,
  category varchar(100),
  sample_type varchar(100),
  fasting_required boolean NOT NULL DEFAULT false,
  preparation_en text,
  about_en text,
  about_ml text,
  typical_price_inr integer,
  report_hours integer NOT NULL DEFAULT 24,
  created_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_lab_tests_cat ON lab_tests_guide (category) WHERE deleted_at IS NULL;

INSERT INTO lab_tests_guide (slug, name_en, name_ml, category, sample_type, fasting_required, preparation_en, about_en, typical_price_inr, report_hours) VALUES
 ('cbc','Complete Blood Count (CBC)','സമ്പൂർണ രക്ത പരിശോധന','Hematology','Blood',false,'No special preparation needed.','Measures red cells, white cells, and platelets — screens for anaemia, infection, and clotting issues.',300,24),
 ('lipid-profile','Lipid Profile','ലിപിഡ് പ്രൊഫൈൽ','Cardiac','Blood',true,'Fast 9–12 hours before the test (water allowed).','Measures cholesterol (LDL, HDL) and triglycerides to assess heart-disease risk.',600,24),
 ('hba1c','HbA1c','എച്ച്ബിഎ1സി','Diabetes','Blood',false,'No fasting required.','Shows average blood sugar over ~3 months — used to monitor diabetes control.',450,24),
 ('tsh','Thyroid (TSH)','തൈറോയ്ഡ് (TSH)','Endocrine','Blood',false,'No special preparation. Morning sample preferred.','Screens thyroid function — high TSH suggests an underactive thyroid.',350,24),
 ('vitamin-d','Vitamin D (25-OH)','വിറ്റാമിൻ D','Nutrition','Blood',false,'No fasting required.','Checks vitamin D levels — deficiency is common and affects bones and immunity.',1200,48),
 ('liver-function','Liver Function Test (LFT)','ലിവർ ഫങ്ഷൻ ടെസ്റ്റ്','Biochemistry','Blood',true,'Fast 8 hours before the test.','Assesses liver enzymes and proteins to detect liver stress or damage.',700,24),
 ('kidney-function','Kidney Function Test (KFT)','കിഡ്നി ഫങ്ഷൻ ടെസ്റ്റ്','Biochemistry','Blood',true,'Fast 8 hours before the test.','Measures creatinine and urea to check how well the kidneys filter waste.',700,24),
 ('urine-routine','Urine Routine','മൂത്ര പരിശോധന','Pathology','Urine',false,'Collect a clean mid-stream sample.','General screen for infection, sugar, and kidney issues.',150,12)
ON CONFLICT (slug) DO NOTHING;
