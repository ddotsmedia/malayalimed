-- Batch 16: appointments/messaging/telehealth/community/emergency/camps/credentials/followups/content.
CREATE TABLE IF NOT EXISTS appointment_slots (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), doctor_id uuid REFERENCES doctors(id), slot_date date, start_time time, end_time time, is_available boolean DEFAULT true, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS appointment_waitlist (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), appointment_id uuid REFERENCES appointments(id), doctor_id uuid REFERENCES doctors(id), patient_id uuid REFERENCES users(id), position int, joined_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS appointment_reschedule_requests (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), appointment_id uuid REFERENCES appointments(id), old_date date, new_date date, status varchar(20) DEFAULT 'pending', requested_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_slots_doctor ON appointment_slots(doctor_id);

CREATE TABLE IF NOT EXISTS messages (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), sender_id uuid REFERENCES users(id), receiver_id uuid REFERENCES users(id), appointment_id uuid REFERENCES appointments(id), message_text text, attachments text[], read_at timestamptz, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS message_threads (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), patient_id uuid REFERENCES users(id), doctor_id uuid REFERENCES users(id), last_message_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS voice_calls (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), patient_id uuid REFERENCES users(id), doctor_id uuid REFERENCES users(id), call_duration int, recording_url text, created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_msg_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_msg_receiver ON messages(receiver_id);

CREATE TABLE IF NOT EXISTS referrals (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), referrer_id uuid REFERENCES users(id), referred_id uuid REFERENCES users(id), referred_email varchar(255), code varchar(40), status varchar(20) DEFAULT 'pending', bonus_amount numeric(12,2) DEFAULT 0, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS referral_rewards (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), user_id uuid REFERENCES users(id), reason varchar(50), reward_points int DEFAULT 0, created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);

CREATE TABLE IF NOT EXISTS telehealth_sessions (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), appointment_id uuid REFERENCES appointments(id), jitsi_room_id varchar(200), started_at timestamptz DEFAULT now(), ended_at timestamptz, duration_minutes int, recording_url text);
CREATE TABLE IF NOT EXISTS session_vitals (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), session_id uuid REFERENCES telehealth_sessions(id), metric_type varchar(50), value numeric(12,2), recorded_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_session_appointment ON telehealth_sessions(appointment_id);

CREATE TABLE IF NOT EXISTS community_posts (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), user_id uuid REFERENCES users(id), title varchar(200), content text, category varchar(50), likes int DEFAULT 0, created_at timestamptz DEFAULT now(), deleted_at timestamptz);
CREATE TABLE IF NOT EXISTS community_comments (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), post_id uuid REFERENCES community_posts(id), user_id uuid REFERENCES users(id), comment text, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS community_likes (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), post_id uuid REFERENCES community_posts(id), user_id uuid REFERENCES users(id), created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_posts_category ON community_posts(category);
CREATE UNIQUE INDEX IF NOT EXISTS idx_like_unique ON community_likes(post_id, user_id);

CREATE TABLE IF NOT EXISTS emergency_contacts (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), hospital_id uuid REFERENCES hospitals(id), phone varchar(20), ambulance_available boolean DEFAULT false, response_time_minutes int);
CREATE TABLE IF NOT EXISTS urgent_care_centers (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), name varchar(200), district_id uuid REFERENCES districts(id), phone varchar(20), address text, hours text, created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_urgent_care_district ON urgent_care_centers(district_id);

CREATE TABLE IF NOT EXISTS health_camps (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), hospital_id uuid REFERENCES hospitals(id), name varchar(200), start_date date, end_date date, description text, free_services text[], registrations int DEFAULT 0, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS camp_registrations (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), camp_id uuid REFERENCES health_camps(id), user_id uuid REFERENCES users(id), registered_at timestamptz DEFAULT now());
CREATE UNIQUE INDEX IF NOT EXISTS idx_camp_reg_unique ON camp_registrations(camp_id, user_id);

CREATE TABLE IF NOT EXISTS doctor_certifications (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), doctor_id uuid REFERENCES doctors(id), cert_name varchar(200), issuing_body varchar(200), issue_date date, expiry_date date);
CREATE TABLE IF NOT EXISTS doctor_awards (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), doctor_id uuid REFERENCES doctors(id), award_name varchar(200), year int, description text);
CREATE TABLE IF NOT EXISTS doctor_publications (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), doctor_id uuid REFERENCES doctors(id), title varchar(300), journal varchar(200), year int, url text);
CREATE INDEX IF NOT EXISTS idx_certs_doctor ON doctor_certifications(doctor_id);

CREATE TABLE IF NOT EXISTS follow_up_schedules (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), appointment_id uuid REFERENCES appointments(id), patient_id uuid REFERENCES users(id), follow_up_date date, notes text, status varchar(20) DEFAULT 'scheduled', created_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_followup_appointment ON follow_up_schedules(appointment_id);
-- health_goals exists (0041); add batch16 columns additively.
ALTER TABLE health_goals ADD COLUMN IF NOT EXISTS goal_name varchar(200);
ALTER TABLE health_goals ADD COLUMN IF NOT EXISTS due_date date;

-- article ratings/comments reference articles (no `news` table); plain uuid, no FK.
CREATE TABLE IF NOT EXISTS article_ratings (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), article_id uuid, user_id uuid REFERENCES users(id), rating int, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS article_comments (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), article_id uuid, user_id uuid REFERENCES users(id), comment text, created_at timestamptz DEFAULT now());
CREATE UNIQUE INDEX IF NOT EXISTS idx_rating_unique ON article_ratings(article_id, user_id);
CREATE INDEX IF NOT EXISTS idx_article_comments ON article_comments(article_id);

-- condition_journeys (referenced by journeys API; not in spec migrations).
CREATE TABLE IF NOT EXISTS condition_journeys (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), slug varchar(120) UNIQUE NOT NULL, title varchar(200) NOT NULL, description text, icon varchar(20), specialty_slug varchar(80), steps jsonb, created_at timestamptz DEFAULT now(), deleted_at timestamptz);
INSERT INTO condition_journeys (slug, title, description, icon, specialty_slug) VALUES
  ('diabetes-care','Diabetes Care Journey','From diagnosis to daily management — tests, diet, and specialists.','🩸','endocrinology'),
  ('heart-health','Heart Health Journey','Understand risk factors, screenings, and cardiology care.','❤️','cardiology'),
  ('maternity','Maternity Journey','Prenatal to postnatal care, checkups, and support.','🤰','gynecology')
ON CONFLICT (slug) DO NOTHING;

-- support tables for FAQ/contact/feedback.
CREATE TABLE IF NOT EXISTS support_faq (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), question text NOT NULL, answer text, category varchar(50), sort int DEFAULT 0);
CREATE TABLE IF NOT EXISTS support_messages (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), user_id uuid REFERENCES users(id), kind varchar(20), name varchar(120), email varchar(200), message text, created_at timestamptz DEFAULT now());
INSERT INTO support_faq (question, answer, category, sort) VALUES
  ('How do I book an appointment?','Search for a doctor, open their profile, and choose an available slot.','appointments',1),
  ('Is my health data private?','Yes. Your records are private to your account and shared only with your care providers.','privacy',2),
  ('How do I get a prescription refill?','Open the prescription and use Request Refill (available 30–90 days after issue).','prescriptions',3)
ON CONFLICT DO NOTHING;
