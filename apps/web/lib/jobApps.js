import { getPool, safeQuery, one } from '@mm/db';

const STAGES = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];
export { STAGES };

export async function apply(jobId, candidateId, { coverNote, resumeId }) {
  try {
    const { rows } = await getPool().query(
      "INSERT INTO job_applications (job_id, candidate_id, cover_note, resume_id, status) VALUES ($1,$2,$3,$4,'applied') ON CONFLICT (job_id, candidate_id) DO NOTHING RETURNING id",
      [jobId, candidateId, coverNote || null, resumeId || null]);
    if (rows.length === 0) return { error: 'already_applied' };
    await getPool().query('INSERT INTO application_pipeline (application_id, stage) VALUES ($1,$2)', [rows[0].id, 'applied']);
    return { id: rows[0].id };
  } catch (err) { return { error: err.message }; }
}
export function myApplications(candidateId) {
  return safeQuery(`SELECT a.id, a.status, a.applied_at, j.title, j.employer, j.location FROM job_applications a JOIN job_listings j ON j.id=a.job_id WHERE a.candidate_id=$1 ORDER BY a.applied_at DESC`, [candidateId]);
}
export function applicationDetail(id, userId) {
  return one(`SELECT a.*, j.title, j.employer, j.employer_id FROM job_applications a JOIN job_listings j ON j.id=a.job_id WHERE a.id=$1 AND (a.candidate_id=$2 OR j.employer_id=$2)`, [id, userId]);
}
export function jobApplications(jobId, employerId) {
  return safeQuery(`SELECT a.id, a.status, a.applied_at, u.full_name AS candidate FROM job_applications a JOIN job_listings j ON j.id=a.job_id JOIN users u ON u.id=a.candidate_id WHERE a.job_id=$1 AND j.employer_id=$2 ORDER BY a.applied_at DESC`, [jobId, employerId]);
}
export async function updateStatus(id, employerId, status) {
  if (!STAGES.includes(status)) return { error: 'bad_stage' };
  const app = await one('SELECT a.id FROM job_applications a JOIN job_listings j ON j.id=a.job_id WHERE a.id=$1 AND j.employer_id=$2', [id, employerId]);
  if (!app) return { error: 'forbidden' };
  await getPool().query('UPDATE job_applications SET status=$2, updated_at=now() WHERE id=$1', [id, status]);
  await getPool().query('INSERT INTO application_pipeline (application_id, stage) VALUES ($1,$2)', [id, status]);
  return { ok: true };
}
export function pipeline(applicationId) {
  return safeQuery('SELECT stage, moved_at FROM application_pipeline WHERE application_id=$1 ORDER BY moved_at ASC', [applicationId]);
}
