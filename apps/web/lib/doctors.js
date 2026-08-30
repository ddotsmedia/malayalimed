// doctors.js — doctor directory CRUD/search (read paths fail soft).
import { safeQuery, one } from '@mm/db';
import { PAGE_SIZE } from './constants.js';

const SELECT = `SELECT d.id, d.slug, d.display_name, d.years_experience, d.consultation_fee,
  d.photo_url, d.rating_avg, d.rating_count, d.consultation_modes, d.languages,
  d.verification_status, s.name_en AS specialty_en, s.name_ml AS specialty_ml, s.slug AS specialty_slug,
  di.name_en AS district_en, di.name_ml AS district_ml
  FROM doctors d
  LEFT JOIN specialties s ON s.id = d.specialty_id
  LEFT JOIN districts di ON di.id = d.district_id`;

export async function searchDoctors({ term, specialty, district, page = 1, limit = PAGE_SIZE } = {}) {
  const where = ["d.deleted_at IS NULL", "d.listing_status='published'"];
  const vals = [];
  if (term) { vals.push(`%${term.toLowerCase()}%`); where.push(`lower(d.display_name) LIKE $${vals.length}`); }
  if (specialty) { vals.push(specialty); where.push(`s.slug = $${vals.length}`); }
  if (district) { vals.push(district); where.push(`di.code = $${vals.length}`); }
  vals.push(limit); const lim = vals.length;
  vals.push((Math.max(1, page) - 1) * limit); const off = vals.length;
  return safeQuery(`${SELECT} WHERE ${where.join(' AND ')} ORDER BY d.rating_avg DESC, d.display_name LIMIT $${lim} OFFSET $${off}`, vals);
}

export function listDoctors(opts) { return searchDoctors(opts); }

export function getDoctorBySlug(slug) {
  return one(`${SELECT} WHERE d.slug = $1 AND d.deleted_at IS NULL`, [slug]);
}

export function doctorAvailability(doctorId) {
  return safeQuery(`SELECT day_of_week, start_time, end_time, slot_minutes, mode
    FROM doctor_availability WHERE doctor_id=$1 AND deleted_at IS NULL ORDER BY day_of_week, start_time`, [doctorId]);
}

export function doctorReviews(doctorId) {
  return safeQuery(`SELECT r.rating, r.title, r.body, r.created_at, u.full_name AS patient_name
    FROM reviews r JOIN users u ON u.id=r.patient_id
    WHERE r.entity_type='doctor' AND r.entity_id=$1 AND r.status='approved' AND r.deleted_at IS NULL
    ORDER BY r.created_at DESC LIMIT 20`, [doctorId]);
}
