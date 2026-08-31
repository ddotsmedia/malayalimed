// patientDashboard.js — aggregated data for the patient home dashboard.
import { safeQuery, one } from '@mm/db';

export async function dashboard(userId) {
  const [kpiRow, appts, metrics] = await Promise.all([
    one(`SELECT
        (SELECT count(*) FROM prescriptions WHERE patient_id=$1 AND deleted_at IS NULL)::int AS rx_count,
        (SELECT count(*) FROM appointments WHERE patient_id=$1 AND deleted_at IS NULL AND slot_date >= current_date AND status IN ('pending','confirmed'))::int AS upcoming_count,
        (SELECT round(avg(LEAST(1.0, current_value/NULLIF(target_value,0)))*100) FROM (
           SELECT g.target_value, (SELECT value FROM health_metrics m WHERE m.patient_id=g.patient_id AND m.metric_type=g.goal_type ORDER BY recorded_date DESC LIMIT 1) AS current_value
           FROM health_goals g WHERE g.patient_id=$1 AND g.status='active') gg)::int AS goals_pct`, [userId]),
    upcomingAppointments(userId, 3),
    recentMetrics(userId),
  ]);
  const kpis = {
    rxCount: kpiRow?.rx_count || 0,
    upcomingCount: kpiRow?.upcoming_count || 0,
    goalsPct: kpiRow?.goals_pct || 0,
    remindersCount: kpiRow?.upcoming_count || 0,
    nextAppointment: appts[0] || null,
  };
  return { kpis, appointments: appts, metrics };
}

export function upcomingAppointments(userId, limit = 3) {
  return safeQuery(`SELECT a.id, a.slot_date, a.slot_start, a.mode, a.status, d.display_name AS doctor_name, d.slug AS doctor_slug,
      (a.slot_date + a.slot_start) AS starts_at,
      ((a.slot_date + a.slot_start) BETWEEN now() AND now()+interval '1 hour') AS join_soon
    FROM appointments a JOIN doctors d ON d.id=a.doctor_id
    WHERE a.patient_id=$1 AND a.deleted_at IS NULL AND a.slot_date >= current_date AND a.status IN ('pending','confirmed')
    ORDER BY a.slot_date ASC, a.slot_start ASC LIMIT $2`, [userId, limit]);
}

export async function recentMetrics(userId) {
  const rows = await safeQuery(`SELECT DISTINCT ON (metric_type) metric_type, value, value2, unit, recorded_date
    FROM health_metrics WHERE patient_id=$1 ORDER BY metric_type, recorded_date DESC`, [userId]);
  const byType = Object.fromEntries(rows.map((r) => [r.metric_type, r]));
  const spark = async (type) => (await safeQuery(
    `SELECT value FROM health_metrics WHERE patient_id=$1 AND metric_type=$2 ORDER BY recorded_date DESC LIMIT 7`, [userId, type]))
    .map((r) => Number(r.value)).reverse();
  return {
    weight: byType.weight ? { latest: Number(byType.weight.value), unit: byType.weight.unit, series: await spark('weight') } : null,
    steps: byType.steps ? { latest: Number(byType.steps.value), series: await spark('steps') } : null,
    blood_pressure: byType.blood_pressure ? { systolic: Number(byType.blood_pressure.value), diastolic: Number(byType.blood_pressure.value2) } : null,
  };
}
