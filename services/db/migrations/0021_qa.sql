-- Ported from khp 0072/0073: patient Q&A (ask doctors). Additive.
CREATE TABLE IF NOT EXISTS qa_questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar(255) UNIQUE NOT NULL,
  patient_id uuid NOT NULL REFERENCES users(id),
  title text NOT NULL,
  body text NOT NULL,
  specialty_id uuid REFERENCES specialties(id),
  is_anonymous boolean NOT NULL DEFAULT false,
  status varchar(20) NOT NULL DEFAULT 'published' CHECK (status IN ('pending','published','rejected')),
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_qa_q_published ON qa_questions (status, created_at DESC) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS qa_answers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id uuid NOT NULL REFERENCES qa_questions(id),
  doctor_id uuid NOT NULL REFERENCES doctors(id),
  body text NOT NULL,
  is_accepted boolean NOT NULL DEFAULT false,
  status varchar(20) NOT NULL DEFAULT 'published' CHECK (status IN ('pending','published','rejected')),
  helpful_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_qa_a_question ON qa_answers (question_id) WHERE deleted_at IS NULL;
