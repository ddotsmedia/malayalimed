const SEV = {
  emergency: { bg: 'bg-red-50 border-red-200', dot: 'bg-red-600', text: 'text-red-700', label: 'Emergency' },
  urgent: { bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500', text: 'text-amber-700', label: 'Urgent' },
  routine: { bg: 'bg-gray-50 border-gray-200', dot: 'bg-gray-400', text: 'text-gray-600', label: 'Routine' },
};

export default function ConditionCard({ condition, locale = 'ml' }) {
  const s = SEV[condition.severity] || SEV.routine;
  return (
    <div className={`rounded-2xl border p-4 ${s.bg}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{condition.name}</h3>
        <span className={`inline-flex items-center gap-1 text-xs font-bold ${s.text}`}><span className={`h-2 w-2 rounded-full ${s.dot}`} />{s.label}</span>
      </div>
      <p className="mt-1 text-sm text-gray-700">{condition.action}</p>
      {condition.doctorSpecialty && (
        <a href={`/${locale}/doctors?q=${encodeURIComponent(condition.doctorSpecialty)}`} className="mt-2 inline-block rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white">
          Find {condition.doctorSpecialty} doctor →
        </a>
      )}
    </div>
  );
}
