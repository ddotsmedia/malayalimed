-- Batch 19: Knowledge Library. medicines/lab_tests/procedures already exist (0026/0023/0028)
-- with NOT NULL name/slug + different schemas, so use NEW library tables (additive, non-breaking).
CREATE TABLE IF NOT EXISTS med_library (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  generic_name varchar(200) NOT NULL UNIQUE,
  brand_names text[], manufacturer varchar(200), strength varchar(100), form varchar(50),
  uses text[], side_effects text[], contraindications text[], dosage_info text,
  created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_med_generic ON med_library(generic_name);
CREATE INDEX IF NOT EXISTS idx_med_brand ON med_library USING GIN(brand_names);

CREATE TABLE IF NOT EXISTS lab_test_library (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_name varchar(200) NOT NULL, test_code varchar(50) UNIQUE, category varchar(100), description text,
  normal_range_male varchar(100), normal_range_female varchar(100), unit varchar(50),
  preparation_needed text, time_to_result varchar(100), cost numeric(10,2), at_home boolean DEFAULT false,
  created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_test_category ON lab_test_library(category);
CREATE TABLE IF NOT EXISTS lab_test_details (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), test_id uuid REFERENCES lab_test_library(id), what_it_measures text, why_ordered_for text[], abnormal_high_means text, abnormal_low_means text);

CREATE TABLE IF NOT EXISTS proc_library (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  procedure_name varchar(200) NOT NULL, specialty varchar(100), description text, why_done text[],
  preparation text, duration_minutes int, recovery_time varchar(100), success_rate numeric(5,2),
  cost_range varchar(100), minimally_invasive boolean DEFAULT false, created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_proc_specialty ON proc_library(specialty);
CREATE TABLE IF NOT EXISTS procedure_steps (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), procedure_id uuid REFERENCES proc_library(id), step_num int, step_description text, duration_minutes int);
CREATE TABLE IF NOT EXISTS procedure_risks (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), procedure_id uuid REFERENCES proc_library(id), risk varchar(200), probability varchar(50), severity varchar(50));

CREATE TABLE IF NOT EXISTS medicine_interactions (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), medicine1_id uuid REFERENCES med_library(id), medicine2_id uuid REFERENCES med_library(id), severity varchar(20), description text);
CREATE TABLE IF NOT EXISTS medicine_alternatives (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), medicine_id uuid REFERENCES med_library(id), alternative_id uuid REFERENCES med_library(id), reason text);
CREATE TABLE IF NOT EXISTS medicine_reviews (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), medicine_id uuid REFERENCES med_library(id), user_id uuid REFERENCES users(id), rating int CHECK (rating BETWEEN 1 AND 5), review_text text, effectiveness_rating int, side_effect_severity int, helpful_count int DEFAULT 0, created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_med_review ON medicine_reviews(medicine_id);

CREATE TABLE IF NOT EXISTS condition_guides (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), condition_name varchar(200) NOT NULL UNIQUE, slug varchar(200), icd10_code varchar(10), overview text, causes text[], symptoms text[], risk_factors text[], diagnosis_tests text[], treatment_options text[], lifestyle_changes text[], prognosis text, complications text[], created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_guide_slug ON condition_guides(slug);
CREATE TABLE IF NOT EXISTS condition_medicines (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), guide_id uuid REFERENCES condition_guides(id), medicine_id uuid REFERENCES med_library(id), typical_dosage varchar(100), effectiveness_rating int);
CREATE TABLE IF NOT EXISTS condition_procedures (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), guide_id uuid REFERENCES condition_guides(id), procedure_id uuid REFERENCES proc_library(id), when_needed text);

CREATE TABLE IF NOT EXISTS dosage_calculators (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), medicine_id uuid REFERENCES med_library(id), patient_type varchar(50), age_range varchar(50), weight_range varchar(50), formula text, example_calculation text);
CREATE TABLE IF NOT EXISTS side_effect_reports (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), medicine_id uuid REFERENCES med_library(id), user_id uuid REFERENCES users(id), side_effect varchar(200), severity varchar(20), duration_days int, reported_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS side_effect_summary (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), medicine_id uuid REFERENCES med_library(id), side_effect varchar(200), frequency_percent numeric(5,2), severity_average numeric(3,2));
CREATE TABLE IF NOT EXISTS interaction_matrix (drug_class1 varchar(100), drug_class2 varchar(100), severity varchar(20), mechanism text, management text, PRIMARY KEY(drug_class1, drug_class2));
CREATE TABLE IF NOT EXISTS search_indexing (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), entity_type varchar(50), entity_id uuid, title varchar(300), keywords text[], content text, category varchar(100), relevance_score numeric(5,2), last_indexed timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_search_keywords ON search_indexing USING GIN(keywords);

-- Seeds.
INSERT INTO med_library (generic_name, brand_names, manufacturer, strength, form, uses, side_effects, contraindications, dosage_info) VALUES
 ('Paracetamol', ARRAY['Crocin','Dolo','Tylenol'], 'GSK', '500mg', 'tablet', ARRAY['fever','pain'], ARRAY['nausea','liver damage'], ARRAY['liver disease'], '1-2 tablets every 6 hours'),
 ('Ibuprofen', ARRAY['Brufen','Advil'], 'Abbott', '400mg', 'tablet', ARRAY['pain','inflammation'], ARRAY['stomach upset','GI bleed'], ARRAY['ulcer','kidney disease'], '1 tablet every 8 hours'),
 ('Metformin', ARRAY['Glycomet','Diabeta'], 'Dr Reddys', '500mg', 'tablet', ARRAY['diabetes type 2'], ARRAY['nausea','lactic acidosis'], ARRAY['kidney disease'], '500-2000mg daily'),
 ('Lisinopril', ARRAY['Lisgrace'], 'Cipla', '10mg', 'tablet', ARRAY['hypertension','heart failure'], ARRAY['dry cough','dizziness'], ARRAY['pregnancy'], '10mg daily'),
 ('Atorvastatin', ARRAY['Lipikind'], 'Sun Pharma', '20mg', 'tablet', ARRAY['cholesterol'], ARRAY['muscle pain'], ARRAY['active liver disease'], '10-40mg daily')
ON CONFLICT DO NOTHING;
INSERT INTO med_library (generic_name, brand_names, manufacturer, strength, form, uses, side_effects, contraindications, dosage_info)
SELECT 'Medicine '||i, ARRAY['Brand'||i], 'Pharma '||i, '100mg', (ARRAY['tablet','syrup','injection','cream'])[((i-1)%4)+1], ARRAY['condition'||i], ARRAY['side'||i], ARRAY['contra'||i], 'Dosage '||i FROM generate_series(6,100) i ON CONFLICT DO NOTHING;

INSERT INTO lab_test_library (test_name, test_code, category, description, normal_range_male, normal_range_female, unit, preparation_needed, time_to_result, cost, at_home) VALUES
 ('Hemoglobin', 'HB', 'Hematology', 'Oxygen-carrying protein in RBCs', '13.5-17.5', '12-15.5', 'g/dL', 'No fasting', '1 hour', 200, true),
 ('HbA1c', 'HBA1C', 'Biochemistry', 'Average blood sugar over 3 months', '<5.7', '<5.7', '%', 'No fasting', '1 day', 300, true),
 ('Total Cholesterol', 'CHOL', 'Biochemistry', 'All cholesterol in blood', '<200', '<200', 'mg/dL', '9-12 hour fasting', '1 day', 250, false),
 ('Creatinine', 'CREA', 'Biochemistry', 'Kidney function marker', '0.7-1.3', '0.6-1.1', 'mg/dL', 'No fasting', '1 day', 200, false),
 ('TSH', 'TSH', 'Serology', 'Thyroid hormone', '0.4-4.0', '0.4-4.0', 'mIU/L', 'No fasting', '1 day', 400, true)
ON CONFLICT DO NOTHING;
INSERT INTO lab_test_library (test_name, test_code, category, description, normal_range_male, normal_range_female, unit, preparation_needed, time_to_result, cost, at_home)
SELECT 'Test '||i, 'CODE'||i, (ARRAY['Hematology','Biochemistry','Serology'])[((i-1)%3)+1], 'Test description '||i, '10-20', '8-18', 'unit', CASE WHEN i%2=0 THEN 'Fasting required' ELSE 'No fasting' END, '1 day', 150+i, i%2=0 FROM generate_series(6,50) i ON CONFLICT DO NOTHING;

INSERT INTO proc_library (procedure_name, specialty, description, why_done, preparation, duration_minutes, recovery_time, success_rate, cost_range, minimally_invasive) VALUES
 ('Coronary Angiography', 'Cardiology', 'Imaging of coronary arteries', ARRAY['chest pain','diagnosis'], 'Fasting 6hrs', 30, '1-2 hours', 98, '15000-25000', true),
 ('Knee Arthroscopy', 'Orthopedics', 'Minimally invasive knee surgery', ARRAY['torn meniscus'], 'Anesthesia', 60, '2-4 weeks', 95, '50000-80000', true),
 ('Cataract Surgery', 'Ophthalmology', 'Remove cloudy lens', ARRAY['cataract'], 'Eye drops', 20, '1-2 weeks', 99, '20000-40000', true),
 ('Appendectomy', 'General Surgery', 'Remove inflamed appendix', ARRAY['appendicitis'], 'Anesthesia', 45, '2-3 weeks', 99, '30000-50000', false),
 ('Colonoscopy', 'Gastroenterology', 'Examine colon', ARRAY['cancer screening'], 'Bowel prep', 30, 'Same day', 98, '5000-10000', true)
ON CONFLICT DO NOTHING;
INSERT INTO proc_library (procedure_name, specialty, description, why_done, preparation, duration_minutes, recovery_time, success_rate, cost_range, minimally_invasive)
SELECT 'Procedure '||i, (ARRAY['Cardiology','Surgery','Orthopedics'])[((i-1)%3)+1], 'Description '||i, ARRAY['Condition '||i], 'Prep '||i, 30+i, 'Recovery '||i, (90+(i%9))::numeric, '₹'||(10000+i*1000)||'-'||(20000+i*1000), i%2=0 FROM generate_series(6,50) i ON CONFLICT DO NOTHING;

INSERT INTO condition_guides (condition_name, slug, icd10_code, overview, causes, symptoms, risk_factors, diagnosis_tests, treatment_options, lifestyle_changes) VALUES
 ('Type 2 Diabetes', 'type-2-diabetes', 'E11', 'High blood sugar due to insulin resistance', ARRAY['obesity','sedentary lifestyle','genetics'], ARRAY['thirst','frequent urination','fatigue'], ARRAY['age>45','obesity'], ARRAY['HbA1c','fasting glucose'], ARRAY['Metformin','insulin','diet+exercise'], ARRAY['weight loss','exercise 30min daily']),
 ('Hypertension', 'hypertension', 'I10', 'High blood pressure', ARRAY['salt intake','stress','genetics'], ARRAY['headache','shortness of breath'], ARRAY['age','obesity'], ARRAY['BP monitoring','ECG'], ARRAY['ACE inhibitor','beta-blocker'], ARRAY['reduce salt','exercise'])
ON CONFLICT DO NOTHING;
INSERT INTO condition_guides (condition_name, slug, icd10_code, overview, causes, symptoms, risk_factors, diagnosis_tests, treatment_options, lifestyle_changes)
SELECT 'Condition '||i, 'condition-'||i, 'ICD'||i, 'Overview '||i, ARRAY['Cause '||i], ARRAY['Symptom '||i], ARRAY['Risk '||i], ARRAY['Test '||i], ARRAY['Treatment '||i], ARRAY['Lifestyle '||i] FROM generate_series(3,30) i ON CONFLICT DO NOTHING;

INSERT INTO search_indexing (entity_type, entity_id, title, keywords, content, category, relevance_score)
SELECT 'medicine', id, generic_name, brand_names || ARRAY[form], generic_name||' '||COALESCE(manufacturer,''), form, 0.9 FROM med_library ON CONFLICT DO NOTHING;
INSERT INTO search_indexing (entity_type, entity_id, title, keywords, content, category, relevance_score)
SELECT 'lab_test', id, test_name, ARRAY[test_code, category], test_name||' '||category, category, 0.85 FROM lab_test_library ON CONFLICT DO NOTHING;
INSERT INTO search_indexing (entity_type, entity_id, title, keywords, content, category, relevance_score)
SELECT 'procedure', id, procedure_name, ARRAY[specialty], procedure_name||' '||specialty, specialty, 0.8 FROM proc_library ON CONFLICT DO NOTHING;
INSERT INTO search_indexing (entity_type, entity_id, title, keywords, content, category, relevance_score)
SELECT 'condition', id, condition_name, ARRAY[icd10_code], condition_name||' '||COALESCE(overview,''), icd10_code, 0.75 FROM condition_guides ON CONFLICT DO NOTHING;
