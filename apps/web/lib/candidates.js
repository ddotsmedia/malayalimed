import { getPool, safeQuery, one } from '@mm/db';

export function myProfile(userId) { return one('SELECT * FROM candidate_profiles WHERE user_id=$1', [userId]); }
export async function upsertProfile(userId, b) {
  const { rows } = await getPool().query(
    `INSERT INTO candidate_profiles (user_id, headline, summary, specialties, experience_years, current_role_title, skills, visibility)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (user_id) DO UPDATE SET headline=$2, summary=$3, specialties=$4, experience_years=$5, current_role_title=$6, skills=$7, visibility=$8
     RETURNING id`,
    [userId, b.headline || null, b.summary || null, b.specialties || null, b.experienceYears ?? null, b.currentRole || null, b.skills || null, b.visibility || 'public']);
  return { id: rows[0].id };
}
export function search({ specialty, location }) {
  const where = ["visibility<>'private'"]; const args = [];
  if (specialty) { args.push(specialty); where.push(`$${args.length} = ANY(specialties)`); }
  if (location) { args.push(`%${location.toLowerCase()}%`); where.push(`lower(array_to_string(preferred_locations,',')) LIKE $${args.length}`); }
  return safeQuery(`SELECT c.user_id, c.headline, c.specialties, c.experience_years, c.skills, u.full_name
    FROM candidate_profiles c JOIN users u ON u.id=c.user_id WHERE ${where.join(' AND ')} ORDER BY c.experience_years DESC NULLS LAST LIMIT 50`, args);
}
export function getProfile(userId) {
  return one(`SELECT c.*, u.full_name, u.email FROM candidate_profiles c JOIN users u ON u.id=c.user_id WHERE c.user_id=$1 AND c.visibility<>'private'`, [userId]);
}
export async function save(recruiterId, candidateId) {
  await getPool().query('INSERT INTO saved_candidates (recruiter_id, candidate_id) VALUES ($1,$2) ON CONFLICT (recruiter_id, candidate_id) DO NOTHING', [recruiterId, candidateId]);
  return { ok: true };
}
export async function unsave(recruiterId, candidateId) { await getPool().query('DELETE FROM saved_candidates WHERE recruiter_id=$1 AND candidate_id=$2', [recruiterId, candidateId]); return { ok: true }; }
export function savedList(recruiterId) {
  return safeQuery('SELECT s.candidate_id, u.full_name, c.headline FROM saved_candidates s JOIN users u ON u.id=s.candidate_id LEFT JOIN candidate_profiles c ON c.user_id=s.candidate_id WHERE s.recruiter_id=$1 ORDER BY s.saved_at DESC', [recruiterId]);
}
