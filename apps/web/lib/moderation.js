// moderation.js — unified content moderation queue (pending reviews + qa).
import { getPool, safeQuery } from '@mm/db';

export async function moderationQueue() {
  const [reviews, questions] = await Promise.all([
    safeQuery(`SELECT r.id, 'review' AS content_type, r.body AS preview, r.rating, u.full_name AS author, r.created_at
      FROM reviews r JOIN users u ON u.id=r.patient_id WHERE r.status IN ('pending','flagged') AND r.deleted_at IS NULL ORDER BY r.created_at DESC LIMIT 100`),
    safeQuery(`SELECT q.id, 'question' AS content_type, q.title AS preview, NULL::int AS rating, u.full_name AS author, q.created_at
      FROM qa_questions q JOIN users u ON u.id=q.patient_id WHERE q.status='pending' AND q.deleted_at IS NULL ORDER BY q.created_at DESC LIMIT 100`).catch(() => []),
  ]);
  return [...reviews, ...questions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function decideModeration(contentType, id, approve) {
  const status = approve ? 'approved' : 'rejected';
  const pool = getPool();
  if (contentType === 'review') {
    const { rowCount } = await pool.query('UPDATE reviews SET status=$2, updated_at=now() WHERE id=$1', [id, status]);
    return rowCount > 0 ? { ok: true } : { error: 'not_found' };
  }
  if (contentType === 'question') {
    const { rowCount } = await pool.query('UPDATE qa_questions SET status=$2 WHERE id=$1', [id, approve ? 'published' : 'rejected']).catch(() => ({ rowCount: 0 }));
    return rowCount > 0 ? { ok: true } : { error: 'not_found' };
  }
  return { error: 'bad_type' };
}
