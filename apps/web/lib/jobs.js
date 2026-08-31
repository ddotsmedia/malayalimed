// jobs.js — healthcare job listings.
import { safeQuery } from '@mm/db';
import { PAGE_SIZE } from './constants.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Advanced filtered search. All filters optional. */
export function searchJobs(f = {}) {
  const where = ["j.deleted_at IS NULL", "j.status='active'"];
  const vals = [];
  const p = (v) => { vals.push(v); return `$${vals.length}`; };            // single param
  if (f.q) { const x = p(`%${String(f.q).toLowerCase()}%`); where.push(`(lower(j.title) LIKE ${x} OR lower(j.employer) LIKE ${x})`); }
  if (f.specialty) {
    if (UUID.test(f.specialty)) where.push(`j.specialty_id=${p(f.specialty)}`);
    else { const x = p(`%${String(f.specialty).toLowerCase()}%`); where.push(`(lower(s.name_en) LIKE ${x} OR s.slug LIKE ${x})`); }
  }
  if (f.district) {
    if (UUID.test(f.district)) where.push(`j.district_id=${p(f.district)}`);
    else { const x = p(`%${String(f.district).toLowerCase()}%`); where.push(`(lower(di.name_en) LIKE ${x} OR lower(di.name_ml) LIKE ${x})`); }
  }
  if (f.salary_min) where.push(`j.salary_max >= ${p(parseInt(f.salary_min, 10))}`);
  if (f.salary_max) where.push(`j.salary_min <= ${p(parseInt(f.salary_max, 10))}`);
  if (f.experience) where.push(`j.experience_level=${p(f.experience)}`);
  if (f.work_mode) where.push(`j.work_mode=${p(f.work_mode)}`);
  if (f.employment_type) where.push(`j.employment_type=${p(f.employment_type)}`);
  const limit = Math.min(parseInt(f.limit, 10) || PAGE_SIZE, 50);
  vals.push(limit); const lim = vals.length;
  vals.push((Math.max(1, parseInt(f.page, 10) || 1) - 1) * limit); const off = vals.length;
  const order = f.sort === 'salary' ? 'j.salary_max DESC NULLS LAST' : 'j.posted_at DESC';
  return safeQuery(`SELECT j.id, j.slug, j.title, j.employer, j.job_type, j.employment_type, j.work_mode, j.experience_level,
      j.salary_min, j.salary_max, j.posted_at, di.name_en AS district_en, s.name_en AS specialty_en
    FROM job_listings j LEFT JOIN districts di ON di.id=j.district_id LEFT JOIN specialties s ON s.id=j.specialty_id
    WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT $${lim} OFFSET $${off}`, vals);
}

export async function jobFilters() {
  const [specialties, districts] = await Promise.all([
    safeQuery(`SELECT DISTINCT s.id, s.name_en FROM specialties s JOIN job_listings j ON j.specialty_id=s.id WHERE j.deleted_at IS NULL AND j.status='active' ORDER BY s.name_en`),
    safeQuery(`SELECT DISTINCT di.id, di.name_en FROM districts di JOIN job_listings j ON j.district_id=di.id WHERE j.deleted_at IS NULL AND j.status='active' ORDER BY di.name_en`),
  ]);
  return { specialties, districts, experience_levels: ['entry', 'mid', 'senior'], work_modes: ['on-site', 'remote', 'hybrid'], employment_types: ['full-time', 'part-time', 'locum', 'contract'] };
}

export async function salaryInsights(specialty, district) {
  const where = ["j.deleted_at IS NULL", "j.status='active'", 'j.salary_min IS NOT NULL'];
  const vals = [];
  if (specialty) { vals.push(`%${String(specialty).toLowerCase()}%`); where.push(`(lower(s.name_en) LIKE $${vals.length} OR s.slug LIKE $${vals.length})`); }
  if (district) { vals.push(`%${String(district).toLowerCase()}%`); where.push(`(lower(di.name_en) LIKE $${vals.length} OR lower(di.name_ml) LIKE $${vals.length})`); }
  const [r] = await safeQuery(`SELECT min(salary_min)::int AS min, max(salary_max)::int AS max,
      round(avg((salary_min+salary_max)/2.0))::int AS avg,
      (percentile_cont(0.5) WITHIN GROUP (ORDER BY (salary_min+salary_max)/2.0))::int AS median,
      (percentile_cont(0.25) WITHIN GROUP (ORDER BY (salary_min+salary_max)/2.0))::int AS p25,
      (percentile_cont(0.75) WITHIN GROUP (ORDER BY (salary_min+salary_max)/2.0))::int AS p75,
      count(*)::int AS n
    FROM job_listings j LEFT JOIN specialties s ON s.id=j.specialty_id LEFT JOIN districts di ON di.id=j.district_id
    WHERE ${where.join(' AND ')}`, vals);
  return r || { min: 0, max: 0, avg: 0, median: 0, p25: 0, p75: 0, n: 0 };
}

export function listJobs({ term, page = 1, limit = PAGE_SIZE } = {}) {
  const where = ["j.deleted_at IS NULL", "j.status='active'"];
  const vals = [];
  if (term) { vals.push(`%${term.toLowerCase()}%`); where.push(`(lower(j.title) LIKE $${vals.length} OR lower(j.employer) LIKE $${vals.length})`); }
  vals.push(limit); const lim = vals.length;
  vals.push((Math.max(1, page) - 1) * limit); const off = vals.length;
  return safeQuery(`SELECT j.id, j.slug, j.title, j.employer, j.job_type, j.salary_min, j.salary_max, j.posted_at,
    di.name_en AS district_en, s.name_en AS specialty_en
    FROM job_listings j LEFT JOIN districts di ON di.id=j.district_id LEFT JOIN specialties s ON s.id=j.specialty_id
    WHERE ${where.join(' AND ')} ORDER BY j.posted_at DESC LIMIT $${lim} OFFSET $${off}`, vals);
}
