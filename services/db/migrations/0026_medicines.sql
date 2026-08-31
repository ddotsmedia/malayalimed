CREATE TABLE IF NOT EXISTS medicines (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar(120) UNIQUE NOT NULL,
  name text NOT NULL, generic_name text,
  form varchar(40), category varchar(80),
  uses_en text, side_effects_en text,
  prescription_required boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines (lower(name)) WHERE deleted_at IS NULL;

INSERT INTO medicines (slug, name, generic_name, form, category, uses_en, side_effects_en, prescription_required) VALUES
 ('paracetamol','Paracetamol','Acetaminophen','Tablet','Analgesic','Relieves mild-to-moderate pain and reduces fever.','Rare at normal doses; liver damage in overdose.',false),
 ('amoxicillin','Amoxicillin','Amoxicillin','Capsule','Antibiotic','Treats bacterial infections of the chest, throat, and urinary tract.','Nausea, diarrhoea, rash. Complete the full course.',true),
 ('metformin','Metformin','Metformin','Tablet','Antidiabetic','First-line medicine for type-2 diabetes.','Stomach upset, metallic taste. Take with food.',true),
 ('amlodipine','Amlodipine','Amlodipine','Tablet','Antihypertensive','Lowers high blood pressure.','Ankle swelling, flushing, headache.',true),
 ('cetirizine','Cetirizine','Cetirizine','Tablet','Antihistamine','Relieves allergy symptoms and itching.','Mild drowsiness.',false)
ON CONFLICT (slug) DO NOTHING;
