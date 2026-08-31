// qa.js — patient Q&A (ask doctors). Ported/adapted from khp qa.js.
import { getPool, safeQuery, one } from '@mm/db';
import crypto from 'node:crypto';

const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9ഀ-ൿ]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

export function listPublishedQuestions({ specialty, page = 1, limit = 20 } = {}) {
  const where = ["q.deleted_at IS NULL", "q.status='published'"];
  const vals = [];
  if (specialty) { vals.push(specialty); where.push(`s.slug=$${vals.length}`); }
  vals.push(limit); const lim = vals.length; vals.push((Math.max(1, page) - 1) * limit); const off = vals.length;
  return safeQuery(`SELECT q.id, q.slug, q.title, q.body, q.is_anonymous, q.views, q.created_at,
    s.name_en AS specialty_en, s.name_ml AS specialty_ml,
    (SELECT count(*) FROM qa_answers a WHERE a.question_id=q.id AND a.status='published' AND a.deleted_at IS NULL)::int AS answer_count
    FROM qa_questions q LEFT JOIN specialties s ON s.id=q.specialty_id
    WHERE ${where.join(' AND ')} ORDER BY q.created_at DESC LIMIT $${lim} OFFSET $${off}`, vals);
}

export async function getQuestionBySlug(slug) {
  const q = await one(`SELECT q.*, s.name_en AS specialty_en, s.name_ml AS specialty_ml
    FROM qa_questions q LEFT JOIN specialties s ON s.id=q.specialty_id
    WHERE q.slug=$1 AND q.deleted_at IS NULL AND q.status='published'`, [slug]);
  if (!q) return null;
  getPool().query('UPDATE qa_questions SET views=views+1 WHERE id=$1', [q.id]).catch(() => {});
  const answers = await safeQuery(`SELECT a.body, a.is_accepted, a.helpful_count, a.created_at, d.display_name AS doctor_name, d.slug AS doctor_slug
    FROM qa_answers a JOIN doctors d ON d.id=a.doctor_id
    WHERE a.question_id=$1 AND a.status='published' AND a.deleted_at IS NULL
    ORDER BY a.is_accepted DESC, a.helpful_count DESC, a.created_at`, [q.id]);
  return { ...q, answers };
}

export async function createQuestion({ patientId, title, body, specialtyId, isAnonymous }) {
  const t = String(title || '').trim(); const b = String(body || '').trim();
  if (!patientId || !t || !b) return { error: 'missing_fields' };
  const slug = `${slugify(t)}-${crypto.randomBytes(3).toString('hex')}`;
  try {
    const { rows } = await getPool().query(
      `INSERT INTO qa_questions (slug, patient_id, title, body, specialty_id, is_anonymous)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, slug`,
      [slug, patientId, t.slice(0, 200), b.slice(0, 4000), specialtyId || null, isAnonymous === true]);
    return { id: rows[0].id, slug: rows[0].slug };
  } catch (err) { return { error: err.message }; }
}
