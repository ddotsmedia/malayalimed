import { safeQuery, one } from '@mm/db';

export function listJourneys() {
  return safeQuery('SELECT id, slug, title, description, icon, specialty_slug FROM condition_journeys WHERE deleted_at IS NULL ORDER BY created_at LIMIT 20');
}
export function getJourney(slug) {
  return one('SELECT * FROM condition_journeys WHERE slug=$1 AND deleted_at IS NULL', [slug]);
}
export async function journeyDoctors(slug) {
  const j = await getJourney(slug);
  const specialty = j?.specialty_slug || slug;
  return safeQuery(`SELECT d.id, d.slug, d.display_name, d.consultation_fee, d.rating_avg, s.name_en AS specialty_en
    FROM doctors d JOIN specialties s ON s.id=d.specialty_id
    WHERE d.deleted_at IS NULL AND d.listing_status='published' AND s.slug ILIKE '%'||$1||'%' LIMIT 12`, [specialty]);
}
