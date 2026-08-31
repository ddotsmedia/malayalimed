export default function AppointmentTimeline({ appointments = [], locale = 'ml' }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-bold text-gray-900">Upcoming appointments</h2>
      {appointments.length === 0 ? <p className="text-sm text-gray-400">No upcoming appointments.</p> : (
        <ul className="space-y-2">
          {appointments.map((a) => (
            <li key={a.id} className="flex items-center gap-3 border-l-2 border-brand pl-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{a.doctor_name}</p>
                <p className="text-xs text-gray-500">{String(a.slot_date).slice(0, 10)} · {String(a.slot_start).slice(0, 5)} · {a.mode}</p>
              </div>
              {a.join_soon && a.mode === 'online'
                ? <a href={`/${locale}/appointments/${a.id}`} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white">Join video</a>
                : <a href={`/${locale}/appointments/${a.id}`} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600">View</a>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
