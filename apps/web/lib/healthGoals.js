import { getPool, safeQuery } from '@mm/db';

export function listGoals(patientId) {
  return safeQuery(`SELECT id, coalesce(goal_name, goal_type) AS goal_name, goal_type, target_value, current_value, unit, due_date, status, created_at
    FROM health_goals WHERE patient_id=$1 ORDER BY created_at DESC`, [patientId]);
}
export async function createGoal(patientId, { goalName, targetValue, currentValue, dueDate }) {
  const { rows } = await getPool().query(
    'INSERT INTO health_goals (patient_id, goal_type, goal_name, target_value, current_value, due_date, status) VALUES ($1,$2,$3,$4,$5,$6,\'active\') RETURNING id',
    [patientId, goalName, goalName, targetValue ?? null, currentValue ?? 0, dueDate || null]);
  return { id: rows[0].id };
}
export async function updateGoal(id, patientId, currentValue) {
  const { rowCount } = await getPool().query('UPDATE health_goals SET current_value=$1 WHERE id=$2 AND patient_id=$3', [currentValue, id, patientId]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found' };
}
