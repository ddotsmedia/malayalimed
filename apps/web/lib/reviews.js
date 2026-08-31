// reviews.js — reviews + ratings for doctors/hospitals (existing reviews table).
import { getPool, safeQuery, one } from '@mm/db';

const TABLE = { doctor: 'doctors', hospital: 'hospitals' };

export function listReviews(entityType, entityId, { page = 1, limit = 10 } = {}) {
  if (!TABLE[entityType]) return Promise.resolve([]);
  return safeQuery(`SELECT r.id, r.rating, r.title, r.body, r.helpful_count, r.created_at, r.patient_id,
    u.full_name AS reviewer_name
    FROM reviews r JOIN users u ON u.id=r.patient_id
    WHERE r.entity_type=$1 AND r.entity_id=$2 AND r.status='approved' AND r.deleted_at IS NULL
    ORDER BY r.created_at DESC LIMIT $3 OFFSET $4`, [entityType, entityId, limit, (Math.max(1, page) - 1) * limit]);
}

export async function reviewStats(entityType, entityId) {
  const [s] = await safeQuery(`SELECT round(avg(rating),1) AS avg, count(*)::int AS count,
    count(*) FILTER (WHERE rating=5)::int AS s5, count(*) FILTER (WHERE rating=4)::int AS s4,
    count(*) FILTER (WHERE rating=3)::int AS s3, count(*) FILTER (WHERE rating=2)::int AS s2,
    count(*) FILTER (WHERE rating=1)::int AS s1
    FROM reviews WHERE entity_type=$1 AND entity_id=$2 AND status='approved' AND deleted_at IS NULL`, [entityType, entityId]);
  return s || { avg: 0, count: 0, s5: 0, s4: 0, s3: 0, s2: 0, s1: 0 };
}

async function recompute(entityType, entityId) {
  const table = TABLE[entityType]; if (!table) return;
  await getPool().query(`UPDATE ${table} SET
    rating_avg = COALESCE((SELECT round(avg(rating),1) FROM reviews WHERE entity_type=$1 AND entity_id=$2 AND status='approved' AND deleted_at IS NULL),0),
    rating_count = (SELECT count(*) FROM reviews WHERE entity_type=$1 AND entity_id=$2 AND status='approved' AND deleted_at IS NULL)
    WHERE id=$2`, [entityType, entityId]).catch(() => {});
}

export async function createReview({ patientId, entityType, entityId, rating, title, body }) {
  if (!TABLE[entityType]) return { error: 'bad_entity' };
  if (!patientId || !entityId) return { error: 'missing_fields' };
  const r = parseInt(rating, 10);
  if (!(r >= 1 && r <= 5)) return { error: 'invalid_rating' };
  try {
    const { rows } = await getPool().query(
      `INSERT INTO reviews (entity_type, entity_id, patient_id, rating, title, body, status)
       VALUES ($1,$2,$3,$4,$5,$6,'approved')
       ON CONFLICT (entity_type, entity_id, patient_id) DO UPDATE SET rating=$4, title=$5, body=$6, status='approved', updated_at=now()
       RETURNING id`,
      [entityType, entityId, patientId, r, String(title || '').slice(0, 200) || null, String(body || '').slice(0, 2000) || null]);
    await recompute(entityType, entityId);
    return { id: rows[0].id };
  } catch (err) { return { error: err.message }; }
}

export async function deleteReview(id, userId, isAdmin) {
  const row = await one('SELECT entity_type, entity_id, patient_id FROM reviews WHERE id=$1 AND deleted_at IS NULL', [id]);
  if (!row) return { error: 'not_found' };
  if (!isAdmin && row.patient_id !== userId) return { error: 'forbidden' };
  await getPool().query('UPDATE reviews SET deleted_at=now() WHERE id=$1', [id]);
  await recompute(row.entity_type, row.entity_id);
  return { ok: true };
}
