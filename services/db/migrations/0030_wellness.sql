CREATE TABLE IF NOT EXISTS wellness_topics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar(120) UNIQUE NOT NULL,
  title_en text NOT NULL, title_ml text,
  category varchar(80), icon text,
  body_en text, body_ml text,
  created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_wellness_cat ON wellness_topics (category) WHERE deleted_at IS NULL;

INSERT INTO wellness_topics (slug, title_en, title_ml, category, icon, body_en) VALUES
 ('good-sleep','Better sleep habits','നല്ല ഉറക്കം','Lifestyle','😴','Keep a fixed sleep schedule, avoid screens before bed, limit caffeine after noon, and keep the room dark and cool. Aim for 7–8 hours a night.'),
 ('stay-hydrated','Staying hydrated','ജലാംശം നിലനിർത്തുക','Nutrition','💧','Drink water regularly through the day, more in heat or after exercise. Watch for dark urine as a sign of dehydration.'),
 ('daily-movement','Move every day','ദിനവും ചലനം','Fitness','🏃','Even 30 minutes of brisk walking most days improves heart health, mood, and sleep. Start small and build gradually.'),
 ('manage-stress','Managing stress','സമ്മർദ്ദ നിയന്ത്രണം','Mental Health','🧘','Practise slow breathing, take short breaks, stay connected with people you trust, and seek help early if stress feels overwhelming.')
ON CONFLICT (slug) DO NOTHING;
