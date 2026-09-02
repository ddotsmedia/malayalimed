import { getPool, safeQuery, one } from '@mm/db';

const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'job';

export function searchJobs(f = {}) {
  const where = ["j.deleted_at IS NULL", "j.status='active'"]; const args = [];
  const p = (v) => { args.push(v); return `$${args.length}`; };
  if (f.q) { const x = p(`%${String(f.q).toLowerCase()}%`); where.push(`(lower(j.title) LIKE ${x} OR lower(j.description) LIKE ${x})`); }
  if (f.specialty) where.push(`(lower(j.specialty) LIKE ${p('%' + String(f.specialty).toLowerCase() + '%')} OR EXISTS(SELECT 1 FROM specialties s WHERE s.id=j.specialty_id AND s.slug ILIKE ${p('%' + f.specialty + '%')}))`);
  if (f.location) where.push(`lower(j.location) LIKE ${p('%' + String(f.location).toLowerCase() + '%')}`);
  if (f.salary_min) where.push(`j.salary_max >= ${p(parseInt(f.salary_min, 10))}`);
  if (f.remote === 'true' || f.remote === true) where.push('j.remote_allowed=true');
  const limit = Math.min(parseInt(f.limit, 10) || 20, 50);
  args.push(limit); const lim = args.length; args.push(((parseInt(f.page, 10) || 1) - 1) * limit); const off = args.length;
  return safeQuery(`SELECT j.id, j.slug, j.title, j.employer, j.specialty, j.location, j.salary_min, j.salary_max, j.job_type, j.remote_allowed, j.experience_level, j.posted_at
    FROM job_listings j WHERE ${where.join(' AND ')} ORDER BY j.posted_at DESC LIMIT $${lim} OFFSET $${off}`, args);
}
export async function getJob(id) {
  const job = await one(`SELECT j.*, di.name_en AS district FROM job_listings j LEFT JOIN districts di ON di.id=j.district_id WHERE j.id=$1 AND j.deleted_at IS NULL`, [id]);
  if (!job) return null;
  const reqs = await safeQuery('SELECT requirement FROM job_requirements WHERE job_id=$1', [id]);
  return { ...job, requirements: reqs.map((r) => r.requirement) };
}
export async function createJob(employerId, b) {
  const { rows } = await getPool().query(
    `INSERT INTO job_listings (slug, title, employer, employer_id, specialty, location, salary_min, salary_max, job_type, remote_allowed, description, status, posted_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'active',now()) RETURNING id`,
    [slugify(b.title) + '-' + Date.now().toString(36), b.title, b.employer || 'Employer', employerId, b.specialty || null, b.location || null,
      b.salaryMin ?? null, b.salaryMax ?? null, b.jobType || 'full_time', b.remoteAllowed === true, b.description || null]);
  return { id: rows[0].id };
}
export async function updateJob(id, employerId, b) {
  const { rowCount } = await getPool().query('UPDATE job_listings SET title=COALESCE($3,title), description=COALESCE($4,description), salary_min=COALESCE($5,salary_min), salary_max=COALESCE($6,salary_max), updated_at=now() WHERE id=$1 AND employer_id=$2', [id, employerId, b.title || null, b.description || null, b.salaryMin ?? null, b.salaryMax ?? null]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found_or_forbidden' };
}
export async function deleteJob(id, employerId) {
  const { rowCount } = await getPool().query('UPDATE job_listings SET deleted_at=now() WHERE id=$1 AND employer_id=$2', [id, employerId]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found_or_forbidden' };
}
export function featured() { return safeQuery("SELECT id, slug, title, employer, specialty, location, salary_min, salary_max FROM job_listings WHERE deleted_at IS NULL AND status='active' ORDER BY posted_at DESC LIMIT 6"); }
export function trending() { return safeQuery('SELECT query, count(*)::int AS n FROM search_history WHERE created_at > now()-interval \'30 days\' AND query IS NOT NULL GROUP BY query ORDER BY n DESC LIMIT 8'); }
export function recruiterJobs(employerId) { return safeQuery("SELECT id, title, status, posted_at, (SELECT count(*) FROM job_applications a WHERE a.job_id=job_listings.id)::int AS applications FROM job_listings WHERE employer_id=$1 AND deleted_at IS NULL ORDER BY posted_at DESC", [employerId]); }
export async function logView(jobId, viewerId) { await getPool().query('INSERT INTO job_views (job_id, viewer_id) VALUES ($1,$2)', [jobId, viewerId || null]).catch(() => {}); }
export async function jobAnalytics(jobId) {
  const [r] = await safeQuery('SELECT (SELECT count(*) FROM job_views WHERE job_id=$1)::int AS views, (SELECT count(*) FROM job_applications WHERE job_id=$1)::int AS applications', [jobId]);
  return r || { views: 0, applications: 0 };
}
