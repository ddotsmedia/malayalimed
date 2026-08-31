// healthRecords.js — patient health records (PHR). Ported/adapted from khp.
import { getPool, safeQuery } from '@mm/db';

export const RECORD_TYPES = ['prescription', 'lab_report', 'imaging', 'vaccination', 'allergy', 'medication', 'condition', 'surgery', 'note'];

export function listRecords(userId, type) {
  const where = ['user_id=$1', 'deleted_at IS NULL'];
  const vals = [userId];
  if (type && RECORD_TYPES.includes(type)) { vals.push(type); where.push(`record_type=$${vals.length}`); }
  return safeQuery(`SELECT id, record_type, title, description, record_date, doctor_name, hospital_name, tags, created_at
    FROM health_records WHERE ${where.join(' AND ')} ORDER BY coalesce(record_date, created_at::date) DESC`, vals);
}

export async function addRecord(userId, { recordType, title, description, recordDate, doctorName, hospitalName }) {
  const t = String(title || '').trim();
  if (!userId || !t) return { error: 'title_required' };
  const type = RECORD_TYPES.includes(recordType) ? recordType : 'note';
  const { rows } = await getPool().query(
    `INSERT INTO health_records (user_id, record_type, title, description, record_date, doctor_name, hospital_name)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
    [userId, type, t.slice(0, 200), description || null, recordDate || null, doctorName || null, hospitalName || null]);
  return { id: rows[0].id };
}
