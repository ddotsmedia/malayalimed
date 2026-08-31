#!/usr/bin/env node
/**
 * Appointment reminder job. Run hourly via system cron:
 *   0 * * * * cd /opt/malayalimed && DATABASE_URL=... node infra/scripts/send-reminders.js
 * Sending is stubbed (no SMS/email provider configured) — it logs + marks reminded_at.
 */
import { getPool } from '../../services/db/index.js';

async function main() {
  const pool = getPool();
  const { rows } = await pool.query(`
    SELECT a.id, a.slot_date, a.slot_start, a.patient_id, u.email, u.mobile,
      COALESCE(rp.sms_enabled,true) AS sms, COALESCE(rp.email_enabled,true) AS email,
      COALESCE(rp.whatsapp_enabled,false) AS whatsapp,
      rp.quiet_hours_start, rp.quiet_hours_end, COALESCE(rp.reminder_hours_before,24) AS hours_before
    FROM appointments a
    JOIN users u ON u.id=a.patient_id
    LEFT JOIN reminder_preferences rp ON rp.patient_id=a.patient_id
    WHERE a.deleted_at IS NULL AND a.status IN ('pending','confirmed') AND a.reminded_at IS NULL
      AND (a.slot_date + a.slot_start) BETWEEN now() AND now() + interval '48 hours'`);

  const nowHm = new Date().toISOString().slice(11, 16);
  let sent = 0;
  for (const r of rows) {
    const due = new Date(`${r.slot_date}T${r.slot_start}`) - Date.now();
    if (due > r.hours_before * 3600 * 1000) continue; // not yet inside the window
    if (r.quiet_hours_start && r.quiet_hours_end) {
      const inQuiet = r.quiet_hours_start < r.quiet_hours_end
        ? (nowHm >= r.quiet_hours_start && nowHm < r.quiet_hours_end)
        : (nowHm >= r.quiet_hours_start || nowHm < r.quiet_hours_end);
      if (inQuiet) continue;
    }
    const channels = [r.sms && 'SMS', r.email && 'email', r.whatsapp && 'WhatsApp'].filter(Boolean);
    // STUB: integrate Fast2SMS / Resend here.
    console.log(`[reminder] appt=${r.id} -> ${channels.join(',') || 'in-app'} (${r.email || r.mobile})`);
    await pool.query('UPDATE appointments SET reminded_at=now() WHERE id=$1', [r.id]);
    sent++;
  }
  console.log(`[reminder] processed=${rows.length} sent=${sent}`);
  await pool.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
