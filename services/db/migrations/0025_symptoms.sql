CREATE TABLE IF NOT EXISTS symptoms (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar(120) UNIQUE NOT NULL,
  name_en text NOT NULL, name_ml text,
  body_area varchar(40) DEFAULT 'general',
  urgency varchar(20) DEFAULT 'routine' CHECK (urgency IN ('routine','soon','urgent','emergency')),
  advice_en text, advice_ml text,
  created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_symptoms_area ON symptoms (body_area) WHERE deleted_at IS NULL;

INSERT INTO symptoms (slug, name_en, name_ml, body_area, urgency, advice_en) VALUES
 ('fever','Fever','പനി','general','routine','Rest and hydrate. See a doctor if it lasts over 3 days or is very high.'),
 ('chest-pain','Chest Pain','നെഞ്ചുവേദന','chest','emergency','Chest pain can be a medical emergency — call 112 / 108 immediately.'),
 ('headache','Headache','തലവേദന','head-neck','routine','Rest, water, and pain relief. Seek care if sudden and severe.'),
 ('cough','Cough','ചുമ','respiratory','routine','Stay hydrated. See a doctor if it persists over 2 weeks or has blood.'),
 ('breathlessness','Breathlessness','ശ്വാസതടസ്സം','respiratory','urgent','Sudden breathlessness needs urgent medical attention.')
ON CONFLICT (slug) DO NOTHING;
