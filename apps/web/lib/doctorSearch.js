// doctorSearch.js — advanced doctor filters + comparison.
import { safeQuery } from '@mm/db';

export function searchDoctors({ insurance, language, minRating, specialty, district, sort } = {}) {
  const where = ["d.deleted_at IS NULL", "d.listing_status='published'"];
  const args = [];
  const p = (v) => { args.push(v); return `$${args.length}`; };
  if (language) where.push(`(${p(language)} = ANY(d.languages) OR ${p(language)} = ANY(sf.languages))`);
  if (insurance) where.push(`${p(insurance)} = ANY(sf.insurance_accepted)`);
  if (minRating) where.push(`d.rating_avg >= ${p(Number(minRating))}`);
  if (specialty) where.push(`s.slug = ${p(specialty)}`);
  if (district) where.push(`di.name_en ILIKE ${p('%' + district + '%')}`);
  const order = sort === 'fee' ? 'd.consultation_fee ASC NULLS LAST' : sort === 'rating' ? 'd.rating_avg DESC' : 'd.rating_avg DESC';
  return safeQuery(`SELECT d.id, d.slug, d.display_name, d.consultation_fee, d.rating_avg, d.rating_count, d.languages,
      s.name_en AS specialty_en, di.name_en AS district_en, sf.insurance_accepted
    FROM doctors d LEFT JOIN specialties s ON s.id=d.specialty_id LEFT JOIN districts di ON di.id=d.district_id
      LEFT JOIN search_filters sf ON sf.doctor_id=d.id
    WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT 100`, args);
}

export function compareDoctors(ids) {
  const list = (Array.isArray(ids) ? ids : String(ids || '').split(',')).filter(Boolean).slice(0, 3);
  if (!list.length) return Promise.resolve([]);
  const ph = list.map((_, i) => `$${i + 1}`).join(',');
  return safeQuery(`SELECT d.id, d.slug, d.display_name, d.consultation_fee, d.rating_avg, d.rating_count, d.years_experience,
      d.languages, s.name_en AS specialty_en, di.name_en AS district_en
    FROM doctors d LEFT JOIN specialties s ON s.id=d.specialty_id LEFT JOIN districts di ON di.id=d.district_id
    WHERE d.id IN (${ph}) AND d.deleted_at IS NULL`, list);
}
