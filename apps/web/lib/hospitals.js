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

// Batch 21 APIs
export async function listHosps(limit = 20, offset = 0) {
  return safeQuery(
    `SELECT id, name_en, name_ml, district, beds_total, icu_beds, general_beds, average_rating, is_verified, accreditations, website, created_at FROM hospitals WHERE deleted_at IS NULL ORDER BY average_rating DESC, created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
}

export async function searchHosps(q, limit = 20, offset = 0) {
  return safeQuery(
    `SELECT id, name_en, name_ml, district, beds_total, icu_beds, general_beds, average_rating, is_verified FROM hospitals WHERE deleted_at IS NULL AND (name_en ILIKE $1 OR name_ml ILIKE $1 OR district ILIKE $1 OR accreditations::text ILIKE $1) ORDER BY average_rating DESC LIMIT $2 OFFSET $3`,
    [`%${q}%`, limit, offset]
  );
}

export async function getHosp(id) {
  const rows = await safeQuery(
    `SELECT id, name_en, name_ml, address, district, lat, lng, phone, email, beds_total, icu_beds, ccu_beds, general_beds, average_rating, is_verified, accreditations, website, created_at, updated_at FROM hospitals WHERE id=$1 AND deleted_at IS NULL`,
    [id]
  );
  return rows[0] || null;
}

export async function getHospDepts(hospId) {
  return safeQuery(
    `SELECT id, department_name, specialty, head_doctor_id, staff_count, created_at FROM hospital_departments WHERE hospital_id=$1 AND deleted_at IS NULL ORDER BY department_name ASC`,
    [hospId]
  );
}

export async function getHospServices(hospId) {
  return safeQuery(
    `SELECT id, service_name, available, description FROM hospital_services WHERE hospital_id=$1 AND deleted_at IS NULL ORDER BY service_name ASC`,
    [hospId]
  );
}

export async function getHospFacilities(hospId) {
  return safeQuery(
    `SELECT id, facility_name, facility_type, count FROM hospital_facilities WHERE hospital_id=$1 AND deleted_at IS NULL ORDER BY facility_name ASC`,
    [hospId]
  );
}

export async function getBedAvailability(hospId) {
  return safeQuery(
    `SELECT id, bed_type, total_beds, available_beds, last_updated_at FROM hospital_beds_availability WHERE hospital_id=$1 ORDER BY bed_type ASC`,
    [hospId]
  );
}

export async function updateBedAvailability(hospId, bedType, availableBeds) {
  return safeQuery(
    `UPDATE hospital_beds_availability SET available_beds=$3, last_updated_at=CURRENT_TIMESTAMP WHERE hospital_id=$1 AND bed_type=$2 RETURNING id, available_beds, last_updated_at`,
    [hospId, bedType, availableBeds]
  );
}

export async function getHospStaff(hospId, limit = 50) {
  return safeQuery(
    `SELECT hs.id, hs.professional_id, hs.position, hs.department, hs.joining_date, p.role, p.specialties, p.average_rating FROM hospital_staff hs JOIN professionals p ON hs.professional_id=p.id WHERE hs.hospital_id=$1 AND hs.deleted_at IS NULL ORDER BY hs.joining_date DESC LIMIT $2`,
    [hospId, limit]
  );
}

export async function getHospReviews(hospId, limit = 10) {
  return safeQuery(
    `SELECT id, reviewer_id, rating, review_text, created_at FROM hospital_reviews WHERE hospital_id=$1 AND deleted_at IS NULL ORDER BY created_at DESC LIMIT $2`,
    [hospId, limit]
  );
}

export async function addReview(hospId, reviewerId, rating, reviewText) {
  return safeQuery(
    `INSERT INTO hospital_reviews (hospital_id, reviewer_id, rating, review_text, created_at, updated_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id, rating, created_at`,
    [hospId, reviewerId, rating, reviewText]
  );
}

export async function getHospAdmins(hospId) {
  return safeQuery(
    `SELECT id, user_id, admin_role FROM hospital_admins WHERE hospital_id=$1 AND deleted_at IS NULL`,
    [hospId]
  );
}

export async function bySpecialty(specialty, limit = 20, offset = 0) {
  return safeQuery(
    `SELECT DISTINCT h.id, h.name_en, h.name_ml, h.district, h.beds_total, h.average_rating FROM hospitals h JOIN hospital_departments hd ON h.id=hd.hospital_id WHERE h.deleted_at IS NULL AND hd.specialty=$1 ORDER BY h.average_rating DESC LIMIT $2 OFFSET $3`,
    [specialty, limit, offset]
  );
}

export async function byDistrict(district, limit = 20, offset = 0) {
  return safeQuery(
    `SELECT id, name_en, name_ml, district, beds_total, icu_beds, general_beds, average_rating, is_verified FROM hospitals WHERE deleted_at IS NULL AND district=$1 ORDER BY average_rating DESC LIMIT $2 OFFSET $3`,
    [district, limit, offset]
  );
}

export async function compareHosps(hospIds) {
  return safeQuery(
    `SELECT id, name_en, name_ml, district, beds_total, icu_beds, ccu_beds, general_beds, average_rating, accreditations FROM hospitals WHERE id=ANY($1::uuid[]) AND deleted_at IS NULL`,
    [hospIds]
  );
}

export async function countHosps() {
  const rows = await safeQuery(`SELECT COUNT(*) as cnt FROM hospitals WHERE deleted_at IS NULL`);
  return rows[0]?.cnt || 0;
}

export async function searchHospsAdvanced(filters = {}) {
  const { q = '', district = '', minRating = 0, minBeds = 0, limit = 20, offset = 0 } = filters;
  const where = ['deleted_at IS NULL'];
  const vals = [];

  if (q) {
    vals.push(`%${q}%`);
    where.push(`(name_en ILIKE $${vals.length} OR address ILIKE $${vals.length})`);
  }
  if (district) {
    vals.push(district);
    where.push(`district = $${vals.length}`);
  }
  if (minRating > 0) {
    vals.push(minRating);
    where.push(`average_rating >= $${vals.length}`);
  }
  if (minBeds > 0) {
    vals.push(minBeds);
    where.push(`beds_total >= $${vals.length}`);
  }

  vals.push(limit);
  vals.push(offset);

  return safeQuery(
    `SELECT id, name_en, name_ml, district, beds_total, icu_beds, general_beds, average_rating, is_verified, accreditations, website FROM hospitals WHERE ${where.join(' AND ')} ORDER BY average_rating DESC LIMIT $${vals.length - 1} OFFSET $${vals.length}`,
    vals
  );
}

export async function getDistinctHospDistricts() {
  return safeQuery(
    `SELECT DISTINCT district FROM hospitals WHERE deleted_at IS NULL AND district IS NOT NULL ORDER BY district`
  );
}

export async function addHospReview(hospId, reviewerId, rating, reviewText) {
  return safeQuery(
    `INSERT INTO hospital_reviews (hospital_id, reviewer_id, rating, review_text, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id, rating, created_at`,
    [hospId, reviewerId, rating, reviewText]
  );
}
