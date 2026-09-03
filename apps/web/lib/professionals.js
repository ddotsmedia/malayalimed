import { safeQuery } from '@mm/db';

export async function listProfs(limit = 20, offset = 0) {
  return safeQuery(
    `SELECT id, role, specialties, bio, location_district, average_rating, verification_status, badges, is_available_for_work, created_at FROM professionals WHERE deleted_at IS NULL ORDER BY average_rating DESC, created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
}

export async function searchProfs(q, limit = 20, offset = 0) {
  return safeQuery(
    `SELECT id, role, specialties, bio, location_district, average_rating, verification_status, badges, is_available_for_work FROM professionals WHERE deleted_at IS NULL AND (role ILIKE $1 OR bio ILIKE $1 OR location_district ILIKE $1 OR specialties::text ILIKE $1) ORDER BY average_rating DESC LIMIT $2 OFFSET $3`,
    [`%${q}%`, limit, offset]
  );
}

export async function getProf(id) {
  const rows = await safeQuery(
    `SELECT id, user_id, role, specialties, bio, profile_photo_url, location_district, average_rating, verification_status, badges, is_available_for_work, created_at, updated_at FROM professionals WHERE id=$1 AND deleted_at IS NULL`,
    [id]
  );
  return rows[0] || null;
}

export async function getProfCredentials(profId) {
  return safeQuery(
    `SELECT id, cred_type, credential_name, credential_number, issue_date, expiry_date, issuing_body, verification_status, verified_at FROM credentials WHERE professional_id=$1 AND deleted_at IS NULL ORDER BY issue_date DESC`,
    [profId]
  );
}

export async function getProfReviews(profId, limit = 10) {
  return safeQuery(
    `SELECT id, reviewer_id, rating, review_text, category, created_at FROM professional_reviews WHERE professional_id=$1 AND deleted_at IS NULL ORDER BY created_at DESC LIMIT $2`,
    [profId, limit]
  );
}

export async function addReview(profId, reviewerId, rating, reviewText, category) {
  return safeQuery(
    `INSERT INTO professional_reviews (professional_id, reviewer_id, rating, review_text, category, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id, rating, created_at`,
    [profId, reviewerId, rating, reviewText, category]
  );
}

export async function listEndorsements(profId) {
  return safeQuery(
    `SELECT id, endorser_id, skill, created_at FROM endorsements WHERE professional_id=$1 ORDER BY created_at DESC`,
    [profId]
  );
}

export async function addEndorsement(profId, endorserId, skill) {
  return safeQuery(
    `INSERT INTO endorsements (professional_id, endorser_id, skill, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) ON CONFLICT DO NOTHING RETURNING id, skill`,
    [profId, endorserId, skill]
  );
}

export async function getProfAvailability(profId) {
  const rows = await safeQuery(
    `SELECT id, open_to_locum, open_to_freelance, open_to_telemedicine, open_to_fulltime FROM professional_availability WHERE professional_id=$1`,
    [profId]
  );
  return rows[0] || null;
}

export async function setProfAvailability(profId, locum, freelance, telemedicine, fulltime) {
  return safeQuery(
    `INSERT INTO professional_availability (professional_id, open_to_locum, open_to_freelance, open_to_telemedicine, open_to_fulltime, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ON CONFLICT (professional_id) DO UPDATE SET open_to_locum=$2, open_to_freelance=$3, open_to_telemedicine=$4, open_to_fulltime=$5, updated_at=CURRENT_TIMESTAMP RETURNING id`,
    [profId, locum, freelance, telemedicine, fulltime]
  );
}

export async function getProfBadges(profId) {
  return safeQuery(
    `SELECT pb.id, pb.badge_type, bd.name, bd.icon_url, bd.description, pb.awarded_date FROM professional_badges pb JOIN badge_definitions bd ON pb.badge_type=bd.badge_type WHERE pb.professional_id=$1 ORDER BY pb.awarded_date DESC`,
    [profId]
  );
}

export async function trendingProfs(limit = 10) {
  return safeQuery(
    `SELECT id, role, specialties, bio, location_district, average_rating, verification_status, badges FROM professionals WHERE deleted_at IS NULL AND verification_status='verified' ORDER BY average_rating DESC, created_at DESC LIMIT $1`,
    [limit]
  );
}

export async function topRatedProfs(limit = 10) {
  return safeQuery(
    `SELECT id, role, specialties, bio, location_district, average_rating, verification_status FROM professionals WHERE deleted_at IS NULL AND average_rating >= 4.5 ORDER BY average_rating DESC LIMIT $1`,
    [limit]
  );
}

export async function getProfsBySpecialty(specialty, limit = 20, offset = 0) {
  return safeQuery(
    `SELECT id, role, specialties, bio, location_district, average_rating, verification_status FROM professionals WHERE deleted_at IS NULL AND specialties @> $1 ORDER BY average_rating DESC LIMIT $2 OFFSET $3`,
    [`{${specialty}}`, limit, offset]
  );
}

export async function getProfsByDistrict(district, limit = 20, offset = 0) {
  return safeQuery(
    `SELECT id, role, specialties, bio, location_district, average_rating, verification_status FROM professionals WHERE deleted_at IS NULL AND location_district=$1 ORDER BY average_rating DESC LIMIT $2 OFFSET $3`,
    [district, limit, offset]
  );
}

export async function countProfs() {
  const rows = await safeQuery(`SELECT COUNT(*) as cnt FROM professionals WHERE deleted_at IS NULL`);
  return rows[0]?.cnt || 0;
}
