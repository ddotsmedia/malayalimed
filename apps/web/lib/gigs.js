import { safeQuery } from '@mm/db';

export async function listGigs(limit = 20, offset = 0) {
  return safeQuery(
    `SELECT id, gig_title, position_type, specialization, hourly_rate, start_date, end_date, location_district, gig_status, created_at FROM gigs WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
}

export async function searchGigs(filters = {}) {
  const { q = '', specialization = '', district = '', minRate = 0, limit = 20, offset = 0 } = filters;
  const where = ['deleted_at IS NULL'];
  const vals = [];

  if (q) {
    vals.push(`%${q}%`);
    where.push(`gig_title ILIKE $${vals.length}`);
  }
  if (specialization) {
    vals.push(specialization);
    where.push(`specialization = $${vals.length}`);
  }
  if (district) {
    vals.push(district);
    where.push(`location_district = $${vals.length}`);
  }
  if (minRate > 0) {
    vals.push(minRate);
    where.push(`hourly_rate >= $${vals.length}`);
  }

  vals.push(limit);
  vals.push(offset);

  return safeQuery(
    `SELECT id, gig_title, position_type, specialization, hourly_rate, start_date, end_date, location_district, gig_status FROM gigs WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT $${vals.length - 1} OFFSET $${vals.length}`,
    vals
  );
}

export async function getGig(id) {
  const rows = await safeQuery(
    `SELECT id, hospital_id, gig_title, position_type, specialization, duration_days, hourly_rate, start_date, end_date, location_district, gig_status, description FROM gigs WHERE id=$1 AND deleted_at IS NULL`,
    [id]
  );
  return rows[0] || null;
}

export async function getGigBookings(gigId) {
  return safeQuery(
    `SELECT gb.id, gb.professional_id, gb.booking_status, gb.booked_at, gb.confirmed_at, p.role, p.specialties, p.average_rating FROM gig_bookings gb JOIN professionals p ON gb.professional_id=p.id WHERE gb.gig_id=$1 AND gb.deleted_at IS NULL ORDER BY gb.booked_at DESC`,
    [gigId]
  );
}

export async function bookGig(gigId, profId) {
  return safeQuery(
    `INSERT INTO gig_bookings (gig_id, professional_id, booking_status, booked_at) VALUES ($1, $2, 'pending', CURRENT_TIMESTAMP) RETURNING id, booking_status, booked_at`,
    [gigId, profId]
  );
}

export async function getUpcomingGigs(limit = 20) {
  return safeQuery(
    `SELECT id, gig_title, specialization, hourly_rate, start_date, end_date, location_district, gig_status FROM gigs WHERE deleted_at IS NULL AND start_date > CURRENT_DATE ORDER BY start_date ASC LIMIT $1`,
    [limit]
  );
}

export async function countGigs() {
  const rows = await safeQuery(`SELECT COUNT(*) as cnt FROM gigs WHERE deleted_at IS NULL AND gig_status='open'`);
  return rows[0]?.cnt || 0;
}
