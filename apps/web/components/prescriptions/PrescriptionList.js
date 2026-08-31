'use client';

export default function PrescriptionList({ rows, locale = 'ml', onDelete, onRefill }) {
  if (!rows.length) return <p className="text-sm text-gray-400">No prescriptions yet.</p>;
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
          <tr><th className="px-3 py-2">Date</th><th className="px-3 py-2">Doctor</th><th className="px-3 py-2">Medicines</th><th className="px-3 py-2 text-right">Actions</th></tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 text-gray-500">{String(p.created_at).slice(0, 10)}</td>
              <td className="px-3 py-2">{p.doctor_name || '—'}</td>
              <td className="px-3 py-2">{Array.isArray(p.medicines) ? p.medicines.length : 0} item(s)</td>
              <td className="whitespace-nowrap px-3 py-2 text-right">
                <a href={`/${locale}/patient/prescriptions/${p.id}`} className="mr-2 rounded bg-slate-700 px-2 py-1 text-xs text-white">View</a>
                <button onClick={() => onRefill(p.id)} className="mr-2 rounded bg-brand px-2 py-1 text-xs text-white">Refill</button>
                <button onClick={() => window.confirm('Delete?') && onDelete(p.id)} className="rounded bg-red-600 px-2 py-1 text-xs text-white">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
