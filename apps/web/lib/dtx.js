import { getPool, safeQuery, one } from '@mm/db';

export function listPrograms() { return safeQuery('SELECT id, name, condition, duration_weeks, modules, description FROM dtx_programs ORDER BY name'); }
export async function enroll(patientId, programId) {
  const r = await getPool().query('INSERT INTO dtx_enrollment (patient_id, program_id) VALUES ($1,$2) ON CONFLICT (patient_id, program_id) DO NOTHING RETURNING id', [patientId, programId]);
  if (r.rowCount === 0) { const e = await one('SELECT id FROM dtx_enrollment WHERE patient_id=$1 AND program_id=$2', [patientId, programId]); return { id: e?.id, already: true }; }
  return { id: r.rows[0].id };
}
export async function dashboard(enrollmentId, patientId) {
  const enr = await one(`SELECT e.id, e.status, e.started_at, p.name, p.modules, p.duration_weeks, p.description
    FROM dtx_enrollment e JOIN dtx_programs p ON p.id=e.program_id WHERE e.id=$1 AND e.patient_id=$2`, [enrollmentId, patientId]);
  if (!enr) return null;
  const [c] = await safeQuery('SELECT count(*)::int AS done FROM dtx_completion WHERE enrollment_id=$1', [enrollmentId]);
  const done = c?.done || 0;
  return { ...enr, completed: done, adherence: enr.modules ? Math.round((done / enr.modules) * 100) : 0 };
}
export async function completeModule(enrollmentId, patientId, moduleNum) {
  const enr = await one('SELECT id FROM dtx_enrollment WHERE id=$1 AND patient_id=$2', [enrollmentId, patientId]);
  if (!enr) return { error: 'not_found' };
  await getPool().query('INSERT INTO dtx_completion (enrollment_id, module_id) VALUES ($1,$2)', [enrollmentId, null]).catch(() => {});
  return { ok: true, module: moduleNum };
}
export function myEnrollments(patientId) {
  return safeQuery(`SELECT e.id, e.status, p.name, p.condition, p.modules,
      (SELECT count(*)::int FROM dtx_completion c WHERE c.enrollment_id=e.id) AS completed
    FROM dtx_enrollment e JOIN dtx_programs p ON p.id=e.program_id WHERE e.patient_id=$1 ORDER BY e.started_at DESC`, [patientId]);
}
