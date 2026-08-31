// doctorPortal.js — doctor dashboard, patients, earnings, encounters.
import { getPool, safeQuery, one } from '@mm/db';

export async function doctorDashboard(doctorId) {
  if (!doctorId) return { kpis: { todayCount: 0, monthEarnings: 0, ratingAvg: 0, upcomingCount: 0 }, upcoming: [] };
  const [k] = await safeQuery(`SELECT
      (SELECT count(*) FROM appointments WHERE doctor_id=$1 AND slot_date=current_date AND deleted_at IS NULL)::int AS today_count,
      (SELECT count(*) FROM appointments WHERE doctor_id=$1 AND slot_date>=current_date AND status='confirmed' AND deleted_at IS NULL)::int AS upcoming_count,
      (SELECT coalesce(sum(amount),0) FROM doctor_earnings WHERE doctor_id=$1 AND earned_at > now()-interval '30 days')::numeric AS month_earnings,
      (SELECT rating_avg FROM doctors WHERE id=$1)::numeric AS rating_avg`, [doctorId]);
  const upcoming = await safeQuery(`SELECT a.id, a.slot_date, a.slot_start, a.status, u.full_name AS patient_name
    FROM appointments a JOIN users u ON u.id=a.patient_id
    WHERE a.doctor_id=$1 AND a.deleted_at IS NULL AND a.slot_date>=current_date ORDER BY a.slot_date, a.slot_start LIMIT 10`, [doctorId]);
  return { kpis: { todayCount: k?.today_count || 0, monthEarnings: Number(k?.month_earnings || 0), ratingAvg: Number(k?.rating_avg || 0), upcomingCount: k?.upcoming_count || 0 }, upcoming };
}

export function doctorPatients(doctorId) {
  if (!doctorId) return Promise.resolve([]);
  return safeQuery(`SELECT u.id, u.full_name, u.email, max(a.slot_date) AS last_visit, count(a.id)::int AS visits
    FROM appointments a JOIN users u ON u.id=a.patient_id
    WHERE a.doctor_id=$1 AND a.deleted_at IS NULL GROUP BY u.id, u.full_name, u.email ORDER BY last_visit DESC LIMIT 300`, [doctorId]);
}

export function doctorEarnings(doctorId, months = 6) {
  if (!doctorId) return Promise.resolve([]);
  return safeQuery(`SELECT to_char(g.m,'YYYY-MM') AS month, coalesce(sum(e.amount),0)::numeric AS amount
    FROM generate_series(date_trunc('month',current_date)-make_interval(months=>$2::int-1), date_trunc('month',current_date), interval '1 month') g(m)
    LEFT JOIN doctor_earnings e ON date_trunc('month',e.earned_at)=g.m AND e.doctor_id=$1
    GROUP BY g.m ORDER BY g.m`, [doctorId, months]);
}

export async function createEncounter(doctorId, { appointmentId, patientId, notes, diagnosis, treatmentPlan, followUpDate, prescriptions }) {
  const pool = getPool();
  const { rows } = await pool.query(
    `INSERT INTO encounter_notes (appointment_id, doctor_id, patient_id, notes, diagnosis, treatment_plan, follow_up_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
    [appointmentId || null, doctorId, patientId || null, notes || null, diagnosis || null, treatmentPlan || null, followUpDate || null]);
  const encId = rows[0].id;
  for (const p of (Array.isArray(prescriptions) ? prescriptions : [])) {
    if (!p.medicineName && !p.medicine_name) continue;
    await pool.query(
      'INSERT INTO encounter_prescriptions (encounter_id, medicine_name, dosage, frequency, duration, instructions) VALUES ($1,$2,$3,$4,$5,$6)',
      [encId, p.medicineName || p.medicine_name, p.dosage || null, p.frequency || null, parseInt(p.duration, 10) || null, p.instructions || null]).catch(() => {});
  }
  return { id: encId };
}

export function patientDetail(doctorId, patientId) {
  return safeQuery(`SELECT e.id, e.diagnosis, e.treatment_plan, e.follow_up_date, e.created_at
    FROM encounter_notes e WHERE e.doctor_id=$1 AND e.patient_id=$2 ORDER BY e.created_at DESC LIMIT 50`, [doctorId, patientId]);
}
