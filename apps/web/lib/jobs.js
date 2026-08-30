// jobs.js — healthcare job listings.
import { safeQuery } from '@mm/db';
import { PAGE_SIZE } from './constants.js';

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
