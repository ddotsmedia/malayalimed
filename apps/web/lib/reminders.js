// reminders.js — appointment reminder preferences.
import { getPool, one } from '@mm/db';

const DEFAULTS = { sms_enabled: true, email_enabled: true, whatsapp_enabled: false, inapp_enabled: true, quiet_hours_start: null, quiet_hours_end: null, reminder_hours_before: 24 };

export async function getPreferences(userId) {
  const row = await one('SELECT sms_enabled, email_enabled, whatsapp_enabled, inapp_enabled, quiet_hours_start, quiet_hours_end, reminder_hours_before FROM reminder_preferences WHERE patient_id=$1', [userId]);
  return row || { ...DEFAULTS };
}

export async function updatePreferences(userId, p) {
  const { rows } = await getPool().query(
    `INSERT INTO reminder_preferences (patient_id, sms_enabled, email_enabled, whatsapp_enabled, inapp_enabled, quiet_hours_start, quiet_hours_end, reminder_hours_before)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (patient_id) DO UPDATE SET
       sms_enabled=$2, email_enabled=$3, whatsapp_enabled=$4, inapp_enabled=$5,
       quiet_hours_start=$6, quiet_hours_end=$7, reminder_hours_before=$8, updated_at=now()
     RETURNING sms_enabled, email_enabled, whatsapp_enabled, inapp_enabled, quiet_hours_start, quiet_hours_end, reminder_hours_before`,
    [userId, p.smsEnabled ?? true, p.emailEnabled ?? true, p.whatsappEnabled ?? false, p.inappEnabled ?? true,
      p.quietHoursStart || null, p.quietHoursEnd || null, p.reminderHoursBefore ?? 24]);
  return rows[0];
}
