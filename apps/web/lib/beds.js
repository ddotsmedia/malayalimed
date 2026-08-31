// beds.js — hospital bed management.
import { getPool, safeQuery } from '@mm/db';

export function listBeds(hospitalId) {
  const args = []; let where = '1=1';
  if (hospitalId) { args.push(hospitalId); where = 'b.hospital_id=$1'; }
  return safeQuery(`SELECT b.id, b.bed_number, b.floor, b.status, b.admitted_at, u.full_name AS patient_name, h.name_en AS hospital_name
    FROM beds b LEFT JOIN users u ON u.id=b.patient_id LEFT JOIN hospitals h ON h.id=b.hospital_id
    WHERE ${where} ORDER BY b.floor, b.bed_number LIMIT 500`, args);
}
export async function updateBedStatus(id, status, patientId) {
  const valid = ['vacant', 'occupied', 'maintenance'];
  if (!valid.includes(status)) return { error: 'bad_status' };
  const admitted = status === 'occupied' ? 'now()' : 'NULL';
  const { rowCount } = await getPool().query(
    `UPDATE beds SET status=$2, patient_id=$3, admitted_at=${admitted} WHERE id=$1`,
    [id, status, status === 'occupied' ? (patientId || null) : null]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found' };
}
export async function addBed({ hospitalId, bedNumber, floor }) {
  const { rows } = await getPool().query('INSERT INTO beds (hospital_id, bed_number, floor) VALUES ($1,$2,$3) RETURNING id',
    [hospitalId || null, bedNumber, parseInt(floor, 10) || null]);
  return { id: rows[0].id };
}
