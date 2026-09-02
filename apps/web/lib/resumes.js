import { getPool, safeQuery, one } from '@mm/db';

export function templates() { return safeQuery('SELECT id, name, sections, layout FROM resume_templates ORDER BY name'); }
export function listResumes(userId) { return safeQuery('SELECT id, title, full_name, updated_at FROM user_resumes WHERE user_id=$1 ORDER BY updated_at DESC', [userId]); }
export function getResume(id, userId) { return one('SELECT * FROM user_resumes WHERE id=$1 AND user_id=$2', [id, userId]); }
export async function createResume(userId, b) {
  const { rows } = await getPool().query('INSERT INTO user_resumes (user_id, template_id, title, full_name, email, phone, summary, data) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id', [userId, b.templateId || null, b.title, b.fullName || null, b.email || null, b.phone || null, b.summary || null, b.data ? JSON.stringify(b.data) : null]);
  return { id: rows[0].id };
}
export async function updateResume(id, userId, b) {
  const { rowCount } = await getPool().query('UPDATE user_resumes SET title=COALESCE($3,title), full_name=COALESCE($4,full_name), summary=COALESCE($5,summary), data=COALESCE($6,data), updated_at=now() WHERE id=$1 AND user_id=$2', [id, userId, b.title || null, b.fullName || null, b.summary || null, b.data ? JSON.stringify(b.data) : null]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found' };
}
export async function deleteResume(id, userId) { const { rowCount } = await getPool().query('DELETE FROM user_resumes WHERE id=$1 AND user_id=$2', [id, userId]); return rowCount > 0 ? { ok: true } : { error: 'not_found' }; }
