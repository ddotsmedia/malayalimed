import { getPool, safeQuery, one } from '@mm/db';

export function myProfile(userId) { return one('SELECT * FROM recruiter_profiles WHERE user_id=$1', [userId]); }
export async function upsertProfile(userId, b) {
  const { rows } = await getPool().query(
    `INSERT INTO recruiter_profiles (user_id, company_name, company_size, industry, description) VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (user_id) DO UPDATE SET company_name=$2, company_size=$3, industry=$4, description=$5 RETURNING id`,
    [userId, b.companyName, b.companySize || null, b.industry || null, b.description || null]);
  return { id: rows[0].id };
}
export async function analytics(userId) {
  const [r] = await safeQuery(`SELECT
    (SELECT count(*) FROM job_listings WHERE employer_id=$1 AND deleted_at IS NULL)::int AS jobs_posted,
    (SELECT count(*) FROM job_views v JOIN job_listings j ON j.id=v.job_id WHERE j.employer_id=$1)::int AS total_views,
    (SELECT count(*) FROM job_applications a JOIN job_listings j ON j.id=a.job_id WHERE j.employer_id=$1)::int AS total_applications,
    (SELECT count(*) FROM job_applications a JOIN job_listings j ON j.id=a.job_id WHERE j.employer_id=$1 AND a.status='hired')::int AS hires`, [userId]);
  return r || { jobs_posted: 0, total_views: 0, total_applications: 0, hires: 0 };
}
