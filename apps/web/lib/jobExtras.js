import { getPool, safeQuery } from '@mm/db';

// Saved filters + alerts + search history + salary.
export function listFilters(userId) { return safeQuery('SELECT id, name, specialties, salary_min, salary_max, remote_only, locations FROM job_filters WHERE user_id=$1 ORDER BY created_at DESC', [userId]); }
export async function saveFilter(userId, b) {
  const { rows } = await getPool().query('INSERT INTO job_filters (user_id, name, specialties, salary_min, salary_max, remote_only, locations) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id', [userId, b.name, b.specialties || null, b.salaryMin ?? null, b.salaryMax ?? null, b.remoteOnly === true, b.locations || null]);
  return { id: rows[0].id };
}
export async function deleteFilter(id, userId) { const { rowCount } = await getPool().query('DELETE FROM job_filters WHERE id=$1 AND user_id=$2', [id, userId]); return rowCount > 0 ? { ok: true } : { error: 'not_found' }; }
export function searchHistory(userId) { return safeQuery('SELECT query, results_count, created_at FROM search_history WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50', [userId]); }
export async function logSearch(userId, query, resultsCount) { await getPool().query('INSERT INTO search_history (user_id, query, results_count) VALUES ($1,$2,$3)', [userId || null, query || null, resultsCount || 0]).catch(() => {}); }

export function listAlerts(userId) { return safeQuery('SELECT a.id, a.frequency, a.is_active, a.last_sent_at, f.name AS filter_name FROM job_alerts a LEFT JOIN job_filters f ON f.id=a.filter_id WHERE a.user_id=$1 ORDER BY a.created_at DESC', [userId]); }
export async function createAlert(userId, { filterId, frequency }) { const { rows } = await getPool().query('INSERT INTO job_alerts (user_id, filter_id, frequency) VALUES ($1,$2,$3) RETURNING id', [userId, filterId || null, frequency || 'daily']); return { id: rows[0].id }; }
export async function updateAlert(id, userId, isActive) { const { rowCount } = await getPool().query('UPDATE job_alerts SET is_active=$3 WHERE id=$1 AND user_id=$2', [id, userId, isActive]); return rowCount > 0 ? { ok: true } : { error: 'not_found' }; }
export async function deleteAlert(id, userId) { const { rowCount } = await getPool().query('DELETE FROM job_alerts WHERE id=$1 AND user_id=$2', [id, userId]); return rowCount > 0 ? { ok: true } : { error: 'not_found' }; }
// NOTE: no email/WebSocket delivery — "test" marks last_sent_at only.
export async function testAlert(id, userId) { const { rowCount } = await getPool().query('UPDATE job_alerts SET last_sent_at=now() WHERE id=$1 AND user_id=$2', [id, userId]); return rowCount > 0 ? { ok: true, note: 'Alert delivery is stubbed (no email service).' } : { error: 'not_found' }; }

export function salaryBenchmark({ specialty, location, experience }) {
  const where = ['1=1']; const args = [];
  if (specialty) { args.push(`%${specialty.toLowerCase()}%`); where.push(`lower(specialty) LIKE $${args.length}`); }
  if (location) { args.push(`%${location.toLowerCase()}%`); where.push(`lower(location) LIKE $${args.length}`); }
  if (experience) { args.push(experience); where.push(`experience_level=$${args.length}`); }
  return safeQuery(`SELECT specialty, role, location, experience_level, salary_min, salary_max, salary_median, data_points FROM salary_data WHERE ${where.join(' AND ')} ORDER BY experience_level LIMIT 50`, args);
}
