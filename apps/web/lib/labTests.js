// labTests.js — lab-test guide (education). Ported/adapted from khp labTests.js.
import { safeQuery, one } from '@mm/db';

export function listLabTests(search = '') {
  const where = ['deleted_at IS NULL'];
  const vals = [];
  if (search) { vals.push(`%${search.toLowerCase()}%`); where.push(`(lower(name_en) LIKE $${vals.length} OR lower(coalesce(category,'')) LIKE $${vals.length})`); }
  return safeQuery(`SELECT slug, name_en, name_ml, category, sample_type, fasting_required, typical_price_inr, report_hours
    FROM lab_tests_guide WHERE ${where.join(' AND ')} ORDER BY name_en`, vals);
}

export function getLabTestBySlug(slug) {
  return one(`SELECT * FROM lab_tests_guide WHERE slug=$1 AND deleted_at IS NULL`, [slug]);
}
