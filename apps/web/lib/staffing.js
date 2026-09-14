import { safeQuery } from '@mm/db';

export async function listLocums(limit = 20, offset = 0) {
  return safeQuery(
    `SELECT id, hospital_id, professional_id, specialty, start_date, end_date, shift_pattern, daily_rate, status FROM locum_assignments WHERE deleted_at IS NULL ORDER BY start_date DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
}

export async function getLocum(id) {
  const rows = await safeQuery(
    `SELECT id, hospital_id, professional_id, specialty, start_date, end_date, shift_pattern, daily_rate, status FROM locum_assignments WHERE id=$1 AND deleted_at IS NULL`,
    [id]
  );
  return rows[0] || null;
}

export async function createLocumAssignment(hospitalId, profId, specialty, startDate, endDate, shiftPattern, dailyRate) {
  return safeQuery(
    `INSERT INTO locum_assignments (hospital_id, professional_id, specialty, start_date, end_date, shift_pattern, daily_rate, status) VALUES ($1, $2, $3, $4, $5, $6, $7, 'active') RETURNING id, status`,
    [hospitalId, profId, specialty, startDate, endDate, shiftPattern, dailyRate]
  );
}

export async function listShiftSlots(filters = {}) {
  const { hospitalId = null, shiftDate = null, limit = 20, offset = 0 } = filters;
  const where = ['deleted_at IS NULL'];
  const vals = [];

  if (hospitalId) {
    vals.push(hospitalId);
    where.push(`hospital_id = $${vals.length}`);
  }
  if (shiftDate) {
    vals.push(shiftDate);
    where.push(`shift_date = $${vals.length}`);
  }

  vals.push(limit);
  vals.push(offset);

  return safeQuery(
    `SELECT id, hospital_id, shift_date, shift_type, specialty, required_staff, filled_staff, slot_status FROM shift_slots WHERE ${where.join(' AND ')} ORDER BY shift_date ASC LIMIT $${vals.length - 1} OFFSET $${vals.length}`,
    vals
  );
}

export async function getShiftSlot(id) {
  const rows = await safeQuery(
    `SELECT id, hospital_id, shift_date, shift_type, specialty, required_staff, filled_staff, slot_status FROM shift_slots WHERE id=$1 AND deleted_at IS NULL`,
    [id]
  );
  return rows[0] || null;
}

export async function updateShiftFilledStaff(slotId, filledCount) {
  return safeQuery(
    `UPDATE shift_slots SET filled_staff=$2 WHERE id=$1 RETURNING id, filled_staff`,
    [slotId, filledCount]
  );
}

export async function getOpenShifts(district = null, limit = 50) {
  const where = ['slot_status=\'open\'', 'shift_date >= CURRENT_DATE'];
  const vals = [];

  if (district) {
    vals.push(district);
    where.push(`(SELECT location_district FROM hospitals WHERE hospitals.id=shift_slots.hospital_id) = $${vals.length}`);
  }

  vals.push(limit);

  return safeQuery(
    `SELECT id, hospital_id, shift_date, shift_type, specialty, required_staff, filled_staff FROM shift_slots WHERE ${where.join(' AND ')} ORDER BY shift_date ASC LIMIT $${vals.length}`,
    vals
  );
}

export async function countOpenShifts() {
  const rows = await safeQuery(`SELECT COUNT(*) as cnt FROM shift_slots WHERE slot_status='open' AND shift_date >= CURRENT_DATE`);
  return rows[0]?.cnt || 0;
}
