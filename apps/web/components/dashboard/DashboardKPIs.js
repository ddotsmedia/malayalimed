export default function DashboardKPIs({ kpis, locale = 'ml' }) {
  const next = kpis.nextAppointment;
  const cards = [
    { label: 'Next appointment', value: next ? String(next.slot_date).slice(5) : '—', sub: next ? next.doctor_name : 'None booked' },
    { label: 'Prescriptions', value: kpis.rxCount, sub: 'on record' },
    { label: 'Goals progress', value: `${kpis.goalsPct || 0}%`, sub: 'active goals' },
    { label: 'Upcoming reminders', value: kpis.remindersCount, sub: 'scheduled' },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-xl font-extrabold text-brand">{c.value}</p>
          <p className="text-xs font-medium text-gray-700">{c.label}</p>
          <p className="text-[11px] text-gray-400">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
