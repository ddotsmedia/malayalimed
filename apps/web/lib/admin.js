// admin.js — read/write data access for the admin panel. Fail-soft reads.
import { getPool } from '@mm/db';
import { safeQuery } from '@mm/db';

export async function adminStats() {
  const [r] = await safeQuery(`SELECT
    (SELECT count(*) FROM users WHERE deleted_at IS NULL)::int AS users,
    (SELECT count(*) FROM users WHERE created_at::date = current_date)::int AS users_today,
    (SELECT count(*) FROM doctors WHERE verification_status='verified' AND deleted_at IS NULL)::int AS doctors_verified,
    (SELECT count(*) FROM doctors WHERE verification_status='pending' AND deleted_at IS NULL)::int AS doctors_pending,
    (SELECT count(*) FROM hospitals WHERE deleted_at IS NULL)::int AS hospitals,
    (SELECT count(*) FROM appointments WHERE slot_date=current_date AND deleted_at IS NULL)::int AS appts_today,
    (SELECT count(*) FROM reviews WHERE status='pending' AND deleted_at IS NULL)::int AS reviews_pending,
    (SELECT coalesce(sum(amount_inr),0) FROM payments WHERE status='paid')::bigint AS revenue`);
  return r || {};
}

export function listUsers(limit = 100) {
  return safeQuery(`SELECT id, full_name, email, mobile, role, is_verified, created_at
    FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT $1`, [limit]);
}

export function listDoctors(status = 'pending') {
  return safeQuery(`SELECT d.id, d.display_name, d.slug, d.reg_no, d.verification_status, d.listing_status,
    s.name_en AS specialty, di.name_en AS district, d.created_at
    FROM doctors d LEFT JOIN specialties s ON s.id=d.specialty_id LEFT JOIN districts di ON di.id=d.district_id
    WHERE d.deleted_at IS NULL AND ($1='all' OR d.verification_status=$1) ORDER BY d.created_at DESC LIMIT 200`, [status]);
}

export function listHospitalsAdmin() {
  return safeQuery(`SELECT h.id, h.name_en, h.slug, h.verification_status, h.listing_status, di.name_en AS district, h.created_at
    FROM hospitals h LEFT JOIN districts di ON di.id=h.district_id WHERE h.deleted_at IS NULL ORDER BY h.created_at DESC LIMIT 200`);
}

export function listAppointmentsAdmin() {
  return safeQuery(`SELECT a.id, a.booking_ref, a.slot_date, a.slot_start, a.status, a.mode,
    d.display_name AS doctor_name, u.full_name AS patient_name
    FROM appointments a JOIN doctors d ON d.id=a.doctor_id JOIN users u ON u.id=a.patient_id
    WHERE a.deleted_at IS NULL ORDER BY a.slot_date DESC, a.slot_start DESC LIMIT 200`);
}

export function listPayments() {
  return safeQuery(`SELECT p.id, p.amount_inr, p.status, p.method, p.created_at, u.full_name AS patient_name
    FROM payments p JOIN users u ON u.id=p.patient_id ORDER BY p.created_at DESC LIMIT 200`);
}

/** Verify/reject/publish a doctor. status: verified|rejected|pending. */
export async function decideDoctor(id, status) {
  if (!['verified', 'rejected', 'pending'].includes(status)) return { error: 'bad_status' };
  const { rowCount } = await getPool().query(
    `UPDATE doctors SET verification_status=$2,
       listing_status = CASE WHEN $2='verified' THEN 'published' ELSE listing_status END,
       updated_at=now() WHERE id=$1 AND deleted_at IS NULL`, [id, status]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found' };
}

export async function decideHospital(id, status) {
  if (!['verified', 'rejected', 'pending'].includes(status)) return { error: 'bad_status' };
  const { rowCount } = await getPool().query(
    `UPDATE hospitals SET verification_status=$2,
       listing_status = CASE WHEN $2='verified' THEN 'published' ELSE listing_status END,
       updated_at=now() WHERE id=$1 AND deleted_at IS NULL`, [id, status]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found' };
}

// ---- Reviews moderation ----
export function listReviewsAdmin({ status, rating, q, page = 1, limit = 50 } = {}) {
  const where = ['r.deleted_at IS NULL']; const args = [];
  if (status) { args.push(status); where.push(`r.status=$${args.length}`); }
  if (rating) { args.push(parseInt(rating, 10)); where.push(`r.rating=$${args.length}`); }
  if (q) { args.push(`%${q}%`); where.push(`(u.full_name ILIKE $${args.length} OR r.body ILIKE $${args.length})`); }
  args.push(limit, (Math.max(1, page) - 1) * limit);
  return safeQuery(`SELECT r.id, r.entity_type, r.entity_id, r.rating, r.title, r.body, r.status, r.helpful_count, r.created_at,
      u.full_name AS reviewer_name,
      COALESCE(d.display_name, h.name_en) AS entity_name
    FROM reviews r JOIN users u ON u.id=r.patient_id
      LEFT JOIN doctors d ON r.entity_type='doctor' AND d.id=r.entity_id
      LEFT JOIN hospitals h ON r.entity_type='hospital' AND h.id=r.entity_id
    WHERE ${where.join(' AND ')} ORDER BY r.created_at DESC LIMIT $${args.length - 1} OFFSET $${args.length}`, args);
}

export async function decideReview(id, status) {
  if (!['pending', 'approved', 'rejected', 'flagged'].includes(status)) return { error: 'bad_status' };
  const before = (await safeQuery('SELECT entity_type, entity_id, status FROM reviews WHERE id=$1 AND deleted_at IS NULL', [id]))[0];
  if (!before) return { error: 'not_found' };
  await getPool().query('UPDATE reviews SET status=$2, updated_at=now() WHERE id=$1', [id, status]);
  const table = before.entity_type === 'doctor' ? 'doctors' : before.entity_type === 'hospital' ? 'hospitals' : null;
  if (table) {
    await getPool().query(`UPDATE ${table} SET
      rating_avg=COALESCE((SELECT round(avg(rating),1) FROM reviews WHERE entity_type=$1 AND entity_id=$2 AND status='approved' AND deleted_at IS NULL),0),
      rating_count=(SELECT count(*) FROM reviews WHERE entity_type=$1 AND entity_id=$2 AND status='approved' AND deleted_at IS NULL)
      WHERE id=$2`, [before.entity_type, before.entity_id]).catch(() => {});
  }
  return { ok: true, before: before.status };
}

// ---- Users ----
export function getUserDetail(id) {
  return safeQuery('SELECT id, full_name, email, mobile, role, is_verified, status, created_at FROM users WHERE id=$1', [id]).then((r) => r[0] || null);
}
export async function updateUser(id, { role, status }) {
  const sets = []; const args = [];
  if (role) { args.push(role); sets.push(`role=$${args.length}`); }
  if (status) { args.push(status); sets.push(`status=$${args.length}`); }
  if (!sets.length) return { error: 'no_fields' };
  args.push(id);
  const { rowCount } = await getPool().query(`UPDATE users SET ${sets.join(', ')}, updated_at=now() WHERE id=$${args.length} AND deleted_at IS NULL`, args);
  return rowCount > 0 ? { ok: true } : { error: 'not_found' };
}

// ---- Analytics/charts ----
export function ratingDistribution() {
  return safeQuery(`SELECT rating, count(*)::int AS n FROM reviews WHERE status='approved' AND deleted_at IS NULL GROUP BY rating ORDER BY rating`);
}
export function appointmentsByStatus() {
  return safeQuery(`SELECT status, count(*)::int AS n FROM appointments WHERE deleted_at IS NULL GROUP BY status`);
}
export function usersByRole() {
  return safeQuery(`SELECT role, count(*)::int AS n FROM users WHERE deleted_at IS NULL GROUP BY role`);
}
export function appointmentTrend(days = 30) {
  return safeQuery(`SELECT to_char(g.day,'MM-DD') AS day, coalesce(c.n,0)::int AS n
    FROM generate_series(current_date-($1-1), current_date, interval '1 day') g(day)
    LEFT JOIN (SELECT slot_date d, count(*) n FROM appointments WHERE deleted_at IS NULL AND slot_date > current_date-$1 GROUP BY 1) c ON c.d=g.day
    ORDER BY g.day`, [days]);
}
export function topDoctorsByRating(limit = 10) {
  return safeQuery(`SELECT display_name, rating_avg, rating_count FROM doctors WHERE deleted_at IS NULL AND rating_count > 0 ORDER BY rating_avg DESC, rating_count DESC LIMIT $1`, [limit]);
}

export async function registrationTrend(days = 30) {
  return safeQuery(`SELECT to_char(g.day,'MM-DD') AS day, coalesce(c.n,0)::int AS n
    FROM generate_series(current_date-($1-1), current_date, interval '1 day') g(day)
    LEFT JOIN (SELECT created_at::date d, count(*) n FROM users WHERE created_at > now()-make_interval(days=>$1) GROUP BY 1) c ON c.d=g.day
    ORDER BY g.day`, [days]);
}
