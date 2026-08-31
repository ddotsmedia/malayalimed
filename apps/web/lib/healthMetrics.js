// healthMetrics.js — patient health tracker data access.
import { getPool, safeQuery } from '@mm/db';
import { METRIC_TYPES, METRIC_UNITS } from './metricTypes.js';

export { METRIC_TYPES, METRIC_UNITS };

export async function addMetric(patientId, { metricType, value, value2, unit }) {
  if (!METRIC_TYPES.includes(metricType)) return { error: 'bad_metric' };
  const v = Number(value);
  if (!Number.isFinite(v)) return { error: 'invalid_value' };
  try {
    await getPool().query(
      `INSERT INTO health_metrics (patient_id, metric_type, value, value2, unit, recorded_date, recorded_at)
       VALUES ($1,$2,$3,$4,$5,current_date,now())
       ON CONFLICT (patient_id, metric_type, recorded_date)
       DO UPDATE SET value=$3, value2=$4, unit=$5, recorded_at=now()`,
      [patientId, metricType, v, value2 != null && value2 !== '' ? Number(value2) : null, unit || METRIC_UNITS[metricType] || null]);
    return { ok: true, recent: await listMetrics(patientId, metricType, 7) };
  } catch (err) { return { error: err.message }; }
}

export function listMetrics(patientId, type, days = 30) {
  const args = [patientId]; const where = ['patient_id=$1'];
  if (type) { args.push(type); where.push(`metric_type=$${args.length}`); }
  args.push(days);
  return safeQuery(`SELECT id, metric_type, value, value2, unit, recorded_date, recorded_at
    FROM health_metrics WHERE ${where.join(' AND ')} AND recorded_date > current_date-$${args.length}
    ORDER BY recorded_date ASC`, args);
}

export async function metricTrends(patientId, type, days = 30) {
  const rows = await listMetrics(patientId, type, days);
  const values = rows.map((r) => Number(r.value));
  const dates = rows.map((r) => (r.recorded_date instanceof Date ? r.recorded_date.toISOString().slice(0, 10) : String(r.recorded_date).slice(0, 10)));
  if (!values.length) return { dates: [], values: [], avg: 0, min: 0, max: 0, trend: 0 };
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const trend = values.length > 1 ? values[values.length - 1] - values[0] : 0;
  return { dates, values, avg: Math.round(avg * 10) / 10, min: Math.min(...values), max: Math.max(...values), trend: Math.round(trend * 10) / 10 };
}

export async function addGoal(patientId, { goalType, targetValue, unit }) {
  if (!goalType) return { error: 'missing_goal' };
  const { rows } = await getPool().query(
    `INSERT INTO health_goals (patient_id, goal_type, target_value, unit) VALUES ($1,$2,$3,$4) RETURNING id`,
    [patientId, goalType, Number(targetValue) || null, unit || METRIC_UNITS[goalType] || null]);
  return { id: rows[0].id };
}

export async function listGoals(patientId) {
  return safeQuery(`SELECT g.id, g.goal_type, g.target_value, g.unit, g.status, g.created_at,
    (SELECT value FROM health_metrics m WHERE m.patient_id=g.patient_id AND m.metric_type=g.goal_type ORDER BY recorded_date DESC LIMIT 1) AS current_value
    FROM health_goals g WHERE g.patient_id=$1 AND g.status='active' ORDER BY g.created_at DESC`, [patientId]);
}
