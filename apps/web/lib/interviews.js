import { getPool, safeQuery, one } from '@mm/db';

export async function proposeInterview(applicationId, userId, { proposedDate, proposedTime, durationMinutes }) {
  const app = await one('SELECT a.id FROM job_applications a JOIN job_listings j ON j.id=a.job_id WHERE a.id=$1 AND (j.employer_id=$2 OR a.candidate_id=$2)', [applicationId, userId]);
  if (!app) return { error: 'forbidden' };
  const { rows } = await getPool().query('INSERT INTO interview_slots (application_id, proposed_date, proposed_time, duration_minutes) VALUES ($1,$2,$3,$4) RETURNING id', [applicationId, proposedDate, proposedTime || null, durationMinutes || 30]);
  return { id: rows[0].id };
}
export function interviewSlots(applicationId) { return safeQuery('SELECT id, proposed_date, proposed_time, duration_minutes, status FROM interview_slots WHERE application_id=$1 ORDER BY proposed_date', [applicationId]); }
export async function confirmInterview(id, status) { await getPool().query('UPDATE interview_slots SET status=$2 WHERE id=$1', [id, status || 'confirmed']); return { ok: true }; }

export async function sendOffer(applicationId, employerId, { offerText, salaryOffered }) {
  const app = await one('SELECT a.id FROM job_applications a JOIN job_listings j ON j.id=a.job_id WHERE a.id=$1 AND j.employer_id=$2', [applicationId, employerId]);
  if (!app) return { error: 'forbidden' };
  const { rows } = await getPool().query("INSERT INTO job_offers (application_id, offer_text, salary_offered, expires_at, status) VALUES ($1,$2,$3,now()+interval '14 days','sent') RETURNING id", [applicationId, offerText || null, salaryOffered ?? null]);
  await getPool().query("UPDATE job_applications SET status='offer', updated_at=now() WHERE id=$1", [applicationId]);
  return { id: rows[0].id };
}
export function getOffer(applicationId, userId) {
  return one(`SELECT o.* FROM job_offers o JOIN job_applications a ON a.id=o.application_id JOIN job_listings j ON j.id=a.job_id WHERE o.application_id=$1 AND (a.candidate_id=$2 OR j.employer_id=$2) ORDER BY o.issued_at DESC LIMIT 1`, [applicationId, userId]);
}
export async function respondOffer(id, candidateId, status) {
  const off = await one('SELECT o.id, a.candidate_id, a.id AS app_id FROM job_offers o JOIN job_applications a ON a.id=o.application_id WHERE o.id=$1', [id]);
  if (!off || off.candidate_id !== candidateId) return { error: 'forbidden' };
  await getPool().query('UPDATE job_offers SET status=$2 WHERE id=$1', [id, status]);
  if (status === 'accepted') await getPool().query("UPDATE job_applications SET status='hired', updated_at=now() WHERE id=$1", [off.app_id]);
  return { ok: true };
}
