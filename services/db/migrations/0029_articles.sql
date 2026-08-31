CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar(160) UNIQUE NOT NULL,
  title_en text NOT NULL, title_ml text,
  category varchar(80) DEFAULT 'news',
  excerpt_en text, body_en text, body_ml text,
  status varchar(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_articles_pub ON articles (status, published_at DESC) WHERE deleted_at IS NULL;

INSERT INTO articles (slug, title_en, title_ml, category, excerpt_en, body_en) VALUES
 ('monsoon-fever-care','Staying safe from monsoon fevers','മൺസൂൺ പനി: ശ്രദ്ധിക്കാം','news','Dengue and viral fevers rise during the Kerala monsoon — here is how to stay protected.','During the monsoon, mosquito-borne and viral fevers spread quickly. Prevent water stagnation around your home, use nets and repellents, drink boiled water, and see a doctor early if fever persists beyond three days.'),
 ('heart-healthy-diet','A heart-healthy Kerala diet','ഹൃദയാരോഗ്യ ഭക്ഷണക്രമം','wellness','Simple, local food choices that support heart health.','Choose fish over red meat, use coconut oil in moderation, add plenty of vegetables and fruit, cut down on fried snacks and sugar, and stay active. Small consistent changes protect your heart over time.'),
 ('vaccination-schedule','Child vaccination — what parents should know','കുട്ടികളുടെ വാക്സിനേഷൻ','news','A quick guide to timely immunisation for children.','Vaccines protect children from serious diseases. Follow the national immunisation schedule, keep a record card, and consult your paediatrician if a dose is missed.')
ON CONFLICT (slug) DO NOTHING;
