// hospitals.js — hospital directory CRUD/search.
import { safeQuery, one } from '@mm/db';
import { PAGE_SIZE } from './constants.js';

const SELECT = `SELECT h.id, h.slug, h.name_en, h.name_ml, h.type, h.emergency_24x7,
  h.bed_count, h.logo_url, h.rating_avg, h.rating_count,
  di.name_en AS district_en, di.name_ml AS district_ml, di.code AS district_code
  FROM hospitals h LEFT JOIN districts di ON di.id = h.district_id`;

export async function searchHospitals({ term, district, page = 1, limit = PAGE_SIZE } = {}) {
  const where = ["h.deleted_at IS NULL", "h.listing_status='published'"];
  const vals = [];
  if (term) { vals.push(`%${term.toLowerCase()}%`); where.push(`(lower(h.name_en) LIKE $${vals.length} OR lower(h.name_ml) LIKE $${vals.length})`); }
  if (district) { vals.push(district); where.push(`di.code = $${vals.length}`); }
  vals.push(limit); const lim = vals.length;
  vals.push((Math.max(1, page) - 1) * limit); const off = vals.length;
  return safeQuery(`${SELECT} WHERE ${where.join(' AND ')} ORDER BY h.rating_avg DESC, h.name_en LIMIT $${lim} OFFSET $${off}`, vals);
}

export function listHospitals(opts) { return searchHospitals(opts); }
export function getHospitalBySlug(slug) { return one(`${SELECT} WHERE h.slug=$1 AND h.deleted_at IS NULL`, [slug]); }
export function hospitalDepartments(id) { return safeQuery('SELECT name_en, name_ml FROM hospital_departments WHERE hospital_id=$1 AND deleted_at IS NULL', [id]); }
export function hospitalServices(id) { return safeQuery('SELECT name_en, name_ml, available_24x7 FROM hospital_services WHERE hospital_id=$1 AND deleted_at IS NULL', [id]); }
