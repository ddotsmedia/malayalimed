// directories.js — diseases, symptoms, medicines, blood banks (read-only, fail-soft).
import { safeQuery, one } from '@mm/db';

const like = (q) => `%${String(q || '').toLowerCase()}%`;

export function listDiseases(q = '') {
  return safeQuery(`SELECT slug, name_en, name_ml, category, overview_en FROM diseases
    WHERE deleted_at IS NULL AND ($1='' OR lower(name_en) LIKE $2) ORDER BY name_en`, [q, like(q)]);
}
export const getDisease = (slug) => one('SELECT * FROM diseases WHERE slug=$1 AND deleted_at IS NULL', [slug]);

export function listSymptoms(q = '') {
  return safeQuery(`SELECT slug, name_en, name_ml, body_area, urgency FROM symptoms
    WHERE deleted_at IS NULL AND ($1='' OR lower(name_en) LIKE $2) ORDER BY name_en`, [q, like(q)]);
}
export const getSymptom = (slug) => one('SELECT * FROM symptoms WHERE slug=$1 AND deleted_at IS NULL', [slug]);

export function listMedicines(q = '') {
  return safeQuery(`SELECT slug, name, generic_name, form, category, prescription_required FROM medicines
    WHERE deleted_at IS NULL AND ($1='' OR lower(name) LIKE $2 OR lower(coalesce(generic_name,'')) LIKE $2) ORDER BY name`, [q, like(q)]);
}
export const getMedicine = (slug) => one('SELECT * FROM medicines WHERE slug=$1 AND deleted_at IS NULL', [slug]);

export function listBloodBanks(q = '') {
  return safeQuery(`SELECT b.slug, b.name, b.phone, b.address, b.available_types, b.is_24x7, di.name_en AS district_en, di.name_ml AS district_ml
    FROM blood_banks b LEFT JOIN districts di ON di.id=b.district_id
    WHERE b.deleted_at IS NULL AND ($1='' OR lower(b.name) LIKE $2) ORDER BY b.name`, [q, like(q)]);
}
