-- Batch 20: Professional Forums + Community Groups. All new tables (no conflicts).
CREATE TABLE IF NOT EXISTS forum_threads (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), specialty varchar(100), thread_type varchar(50), title varchar(300) NOT NULL, content text, author_id uuid REFERENCES users(id), is_anonymous boolean DEFAULT false, views int DEFAULT 0, helpful_count int DEFAULT 0, reply_count int DEFAULT 0, created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_forum_specialty ON forum_threads(specialty);
CREATE INDEX IF NOT EXISTS idx_forum_type ON forum_threads(thread_type);
CREATE TABLE IF NOT EXISTS forum_replies (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), thread_id uuid REFERENCES forum_threads(id) ON DELETE CASCADE, author_id uuid REFERENCES users(id), content text, is_anonymous boolean DEFAULT false, upvotes int DEFAULT 0, is_helpful boolean DEFAULT false, created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_reply_thread ON forum_replies(thread_id);
CREATE TABLE IF NOT EXISTS forum_bookmarks (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), user_id uuid REFERENCES users(id) ON DELETE CASCADE, thread_id uuid REFERENCES forum_threads(id) ON DELETE CASCADE, created_at timestamptz DEFAULT now(), UNIQUE(user_id, thread_id));
CREATE TABLE IF NOT EXISTS forum_moderation_log (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), post_id uuid, action varchar(50), admin_id uuid REFERENCES users(id), reason text, created_at timestamptz DEFAULT now());

CREATE TABLE IF NOT EXISTS groups (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), name varchar(300) NOT NULL, description text, type varchar(50), creator_id uuid REFERENCES users(id), hospital_id uuid, specialty varchar(100), condition_name varchar(200), district varchar(100), member_count int DEFAULT 0, is_private boolean DEFAULT false, created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_group_type ON groups(type);
CREATE INDEX IF NOT EXISTS idx_group_specialty ON groups(specialty);
CREATE TABLE IF NOT EXISTS group_members (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), group_id uuid REFERENCES groups(id) ON DELETE CASCADE, user_id uuid REFERENCES users(id) ON DELETE CASCADE, role varchar(50) DEFAULT 'member', joined_at timestamptz DEFAULT now(), UNIQUE(group_id, user_id));
CREATE INDEX IF NOT EXISTS idx_member_group ON group_members(group_id);
CREATE TABLE IF NOT EXISTS group_posts (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), group_id uuid REFERENCES groups(id) ON DELETE CASCADE, author_id uuid REFERENCES users(id), content text, created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_post_group ON group_posts(group_id);
CREATE TABLE IF NOT EXISTS group_chat (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), group_id uuid REFERENCES groups(id) ON DELETE CASCADE, user_id uuid REFERENCES users(id), message text, created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_chat_group ON group_chat(group_id, created_at DESC);
CREATE TABLE IF NOT EXISTS group_resources (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), group_id uuid REFERENCES groups(id) ON DELETE CASCADE, title varchar(300), url_or_file_key text, uploaded_by uuid REFERENCES users(id), created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS group_events (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), group_id uuid REFERENCES groups(id) ON DELETE CASCADE, title varchar(300), description text, event_date date, event_type varchar(50), registration_url text, created_at timestamptz DEFAULT now());

-- Seeds. Specialty groups.
INSERT INTO groups (name, description, type, specialty)
SELECT s, s||' — professional forum', 'specialty', s FROM (VALUES ('Cardiology'),('Orthopedics'),('Neurology'),('Pediatrics'),('Psychiatry'),('Gynecology'),('ENT'),('Ophthalmology'),('Dentistry')) v(s)
WHERE NOT EXISTS (SELECT 1 FROM groups g WHERE g.specialty=v.s AND g.type='specialty');
-- Support groups.
INSERT INTO groups (name, description, type, condition_name)
SELECT c||' Support Group', 'Patients and families managing '||c, 'support', c FROM (VALUES ('Type 2 Diabetes'),('Hypertension'),('Heart Disease'),('Cancer'),('Asthma'),('Arthritis')) v(c)
WHERE NOT EXISTS (SELECT 1 FROM groups g WHERE g.condition_name=v.c AND g.type='support');
-- Forum threads (professional cases + patient questions + general) = 16.
INSERT INTO forum_threads (specialty, thread_type, title, content) VALUES
 ('Cardiology','professional_case','Case: Acute MI in 45y male','Patient presentation with chest pain and ST elevation.'),
 ('Cardiology','professional_case','Arrhythmia management approaches','Discussion on rate vs rhythm control.'),
 ('Orthopedics','professional_case','ACL repair outcomes','Comparing surgical techniques.'),
 ('Neurology','professional_case','Migraine prophylaxis options','Preventive strategies review.'),
 ('Pediatrics','professional_case','Vaccination schedule updates','Latest immunization guidance.'),
 ('General','general','Best practices for patient communication','Sharing tips on explaining diagnoses.'),
 ('General','general','Managing burnout in healthcare','Support and strategies.'),
 ('General','general','Telemedicine adoption in Kerala','Experiences and challenges.'),
 ('Gynecology','professional_case','PCOS management','Lifestyle and medical approaches.'),
 ('Psychiatry','professional_case','Anxiety treatment pathways','First-line therapies.'),
 ('ENT','professional_case','Chronic sinusitis workup','Diagnostic approach.')
ON CONFLICT DO NOTHING;
INSERT INTO forum_threads (specialty, thread_type, title, content) VALUES
 ('General','patient_question','Q: How do I manage my blood pressure?','Looking for lifestyle advice.'),
 ('General','patient_question','Q: What diet is best for diabetes?','Need guidance on meals.'),
 ('General','patient_question','Q: Medication side effects concern','When to worry about side effects.'),
 ('General','patient_question','Q: When should I see a doctor?','Not sure if symptoms are serious.'),
 ('General','hospital_ops','Staffing rota optimization','Discussion for hospital admins.')
ON CONFLICT DO NOTHING;
-- Welcome posts + admin membership (real users only, FK-safe).
INSERT INTO group_posts (group_id, content) SELECT id, 'Welcome to '||name||'! Please introduce yourself.' FROM groups WHERE NOT EXISTS (SELECT 1 FROM group_posts p WHERE p.group_id=groups.id);
INSERT INTO group_members (group_id, user_id, role)
SELECT g.id, u.id, 'member' FROM groups g CROSS JOIN (SELECT id FROM users WHERE role='platform_admin' LIMIT 1) u
ON CONFLICT (group_id, user_id) DO NOTHING;
UPDATE groups SET member_count = (SELECT count(*) FROM group_members m WHERE m.group_id=groups.id);
