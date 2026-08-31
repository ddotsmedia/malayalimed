// analytics.js — admin analytics aggregates.
import { safeQuery, one } from '@mm/db';

export async function revenueAnalytics() {
  const [totals] = await safeQuery(`SELECT
      coalesce(sum(amount) FILTER (WHERE status='paid'),0)::numeric AS total_paid,
      coalesce(sum(amount) FILTER (WHERE status<>'paid'),0)::numeric AS total_pending FROM invoices`);
  const daily = await safeQuery(`SELECT to_char(g.day,'MM-DD') AS day, coalesce(sum(i.amount),0)::numeric AS amount
    FROM generate_series(current_date-29, current_date, interval '1 day') g(day)
    LEFT JOIN invoices i ON i.paid_at::date=g.day AND i.status='paid' GROUP BY g.day ORDER BY g.day`);
  const byDoctor = await safeQuery(`SELECT d.display_name, coalesce(sum(i.amount),0)::numeric AS revenue
    FROM invoices i JOIN doctors d ON d.id=i.doctor_id WHERE i.status='paid' GROUP BY d.display_name ORDER BY revenue DESC LIMIT 10`);
  return { totals: { paid: Number(totals?.total_paid || 0), pending: Number(totals?.total_pending || 0) }, daily, byDoctor };
}

export async function appointmentAnalytics() {
  const daily = await safeQuery(`SELECT to_char(g.day,'MM-DD') AS day, coalesce(c.cnt,0)::int AS cnt
    FROM generate_series(current_date-29, current_date, interval '1 day') g(day)
    LEFT JOIN (SELECT created_at::date d, count(*) cnt FROM appointments WHERE deleted_at IS NULL GROUP BY 1) c ON c.d=g.day ORDER BY g.day`);
  const byStatus = await safeQuery(`SELECT status, count(*)::int AS n FROM appointments WHERE deleted_at IS NULL GROUP BY status`);
  const [tot] = await safeQuery(`SELECT count(*)::int AS total, count(*) FILTER (WHERE status='no_show')::int AS no_shows FROM appointments WHERE deleted_at IS NULL`);
  const noShowRate = tot && tot.total ? Math.round((tot.no_shows / tot.total) * 100) : 0;
  return { daily, byStatus, noShowRate };
}

export async function patientAnalytics() {
  const [k] = await safeQuery(`SELECT
      (SELECT count(*) FROM users WHERE role='patient' AND deleted_at IS NULL)::int AS total,
      (SELECT count(DISTINCT patient_id) FROM appointments WHERE created_at > now()-interval '30 days' AND deleted_at IS NULL)::int AS active,
      (SELECT count(*) FROM users WHERE role='patient' AND created_at > date_trunc('month',current_date))::int AS new_month`);
  const trend = await safeQuery(`SELECT to_char(g.day,'MM-DD') AS day, coalesce(c.n,0)::int AS n
    FROM generate_series(current_date-89, current_date, interval '1 day') g(day)
    LEFT JOIN (SELECT created_at::date d, count(*) n FROM users WHERE role='patient' GROUP BY 1) c ON c.d=g.day ORDER BY g.day`);
  return { kpis: { total: k?.total || 0, active: k?.active || 0, newMonth: k?.new_month || 0 }, trend };
}

export function doctorPerformance() {
  return safeQuery(`SELECT d.id, d.display_name, d.rating_avg, d.rating_count,
      (SELECT count(*) FROM appointments a WHERE a.doctor_id=d.id AND a.deleted_at IS NULL)::int AS appointments,
      (SELECT coalesce(sum(i.amount),0) FROM invoices i WHERE i.doctor_id=d.id AND i.status='paid')::numeric AS revenue
    FROM doctors d WHERE d.deleted_at IS NULL ORDER BY appointments DESC LIMIT 50`);
}
