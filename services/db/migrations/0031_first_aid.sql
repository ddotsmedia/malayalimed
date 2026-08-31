CREATE TABLE IF NOT EXISTS first_aid_guides (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar(120) UNIQUE NOT NULL,
  title_en text NOT NULL, title_ml text,
  steps_en text NOT NULL, steps_ml text,
  call_help boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);

INSERT INTO first_aid_guides (slug, title_en, title_ml, steps_en, call_help) VALUES
 ('burns','Minor burns','ചെറിയ പൊള്ളൽ','1. Cool the burn under running water for 20 minutes. 2. Remove tight items near the area. 3. Cover with a clean, non-stick dressing. 4. Do NOT apply ice, butter, or toothpaste. Seek care for large or deep burns.',false),
 ('choking','Choking (adult)','ശ്വാസതടസ്സം','1. Encourage coughing. 2. Give up to 5 back blows between the shoulder blades. 3. Give up to 5 abdominal thrusts. 4. Repeat until cleared. Call 108/112 if the person becomes unresponsive.',true),
 ('bleeding','Severe bleeding','കടുത്ത രക്തസ്രാവം','1. Apply firm, direct pressure with a clean cloth. 2. Keep pressing; add more cloth if needed. 3. Raise the injured part if possible. 4. Call 108 immediately for heavy bleeding.',true),
 ('fainting','Fainting','ബോധക്ഷയം','1. Lay the person flat and raise their legs. 2. Loosen tight clothing. 3. Ensure fresh air. 4. If they do not recover quickly, call 108/112.',true)
ON CONFLICT (slug) DO NOTHING;
