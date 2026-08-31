'use client';
import { useEffect, useState } from 'react';
import ReminderToggle from '@/components/reminders/ReminderToggle';

export default function NotificationSettingsClient() {
  const [p, setP] = useState(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch('/api/patient/reminder-preferences').then((r) => r.json()).then((j) => j.data && setP({
      smsEnabled: j.data.sms_enabled, emailEnabled: j.data.email_enabled, whatsappEnabled: j.data.whatsapp_enabled,
      inappEnabled: j.data.inapp_enabled, quietHoursStart: j.data.quiet_hours_start?.slice(0, 5) || '',
      quietHoursEnd: j.data.quiet_hours_end?.slice(0, 5) || '', reminderHoursBefore: j.data.reminder_hours_before ?? 24,
    })).catch(() => {});
  }, []);

  if (!p) return <p className="text-sm text-gray-500">Loading…</p>;
  const set = (k, v) => setP((s) => ({ ...s, [k]: v }));

  async function save() {
    setBusy(true); setMsg('');
    const r = await fetch('/api/patient/reminder-preferences', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...p, quietHoursStart: p.quietHoursStart || null, quietHoursEnd: p.quietHoursEnd || null }) });
    const j = await r.json();
    setBusy(false);
    setMsg(r.ok ? 'Saved ✓' : (j.errors?.[0] || 'Failed'));
  }

  const channels = p.smsEnabled ? 'SMS' : p.emailEnabled ? 'email' : p.whatsappEnabled ? 'WhatsApp' : 'in-app';
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-brand/30 bg-brand/5 p-3 text-sm text-gray-700">
        🔔 You will get a <b>{channels}</b> reminder <b>{p.reminderHoursBefore} hours</b> before your appointment.
      </div>
      <div className="space-y-2">
        <ReminderToggle label="SMS" hint="Text message reminders" checked={p.smsEnabled} onChange={(v) => set('smsEnabled', v)} />
        <ReminderToggle label="Email" checked={p.emailEnabled} onChange={(v) => set('emailEnabled', v)} />
        <ReminderToggle label="WhatsApp" checked={p.whatsappEnabled} onChange={(v) => set('whatsappEnabled', v)} />
        <ReminderToggle label="In-app" checked={p.inappEnabled} onChange={(v) => set('inappEnabled', v)} />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <p className="mb-2 text-sm font-medium text-gray-800">Quiet hours (no reminders)</p>
        <div className="flex items-center gap-2 text-sm">
          <input type="time" value={p.quietHoursStart} onChange={(e) => set('quietHoursStart', e.target.value)} className="rounded-lg border border-gray-300 px-2 py-1" />
          <span className="text-gray-400">to</span>
          <input type="time" value={p.quietHoursEnd} onChange={(e) => set('quietHoursEnd', e.target.value)} className="rounded-lg border border-gray-300 px-2 py-1" />
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <label className="text-sm font-medium text-gray-800">Remind me <input type="number" min="1" max="72" value={p.reminderHoursBefore} onChange={(e) => set('reminderHoursBefore', Number(e.target.value))} className="mx-1 w-16 rounded-lg border border-gray-300 px-2 py-1" /> hours before</label>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={busy} className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Saving…' : 'Save'}</button>
        {msg && <span className="text-sm font-semibold text-brand">{msg}</span>}
      </div>
    </div>
  );
}
