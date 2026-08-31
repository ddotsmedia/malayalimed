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

export function listProcedures(q = '') {
  return safeQuery(`SELECT slug, name_en, name_ml, category, about_en, typical_cost_inr FROM procedures
    WHERE deleted_at IS NULL AND ($1='' OR lower(name_en) LIKE $2) ORDER BY name_en`, [q, like(q)]);
}
export const getProcedure = (slug) => one('SELECT * FROM procedures WHERE slug=$1 AND deleted_at IS NULL', [slug]);

export function listArticles(q = '') {
  return safeQuery(`SELECT slug, title_en, title_ml, category, excerpt_en, published_at FROM articles
    WHERE deleted_at IS NULL AND status='published' AND ($1='' OR lower(title_en) LIKE $2) ORDER BY published_at DESC`, [q, like(q)]);
}
export const getArticle = (slug) => one("SELECT * FROM articles WHERE slug=$1 AND deleted_at IS NULL AND status='published'", [slug]);

export function listWellness(q = '') {
  return safeQuery(`SELECT slug, title_en, title_ml, category, icon, body_en FROM wellness_topics
    WHERE deleted_at IS NULL AND ($1='' OR lower(title_en) LIKE $2) ORDER BY title_en`, [q, like(q)]);
}
export const getWellness = (slug) => one('SELECT * FROM wellness_topics WHERE slug=$1 AND deleted_at IS NULL', [slug]);

export function listFirstAid() {
  return safeQuery('SELECT slug, title_en, title_ml, steps_en, steps_ml, call_help FROM first_aid_guides WHERE deleted_at IS NULL ORDER BY title_en');
}
export const getFirstAid = (slug) => one('SELECT * FROM first_aid_guides WHERE slug=$1 AND deleted_at IS NULL', [slug]);
