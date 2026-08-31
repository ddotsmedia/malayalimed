export default function ReminderToggle({ label, hint, checked, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3">
      <span><span className="text-sm font-medium text-gray-800">{label}</span>{hint && <span className="block text-xs text-gray-400">{hint}</span>}</span>
      <button type="button" onClick={() => onChange(!checked)} className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-brand' : 'bg-gray-300'}`} aria-pressed={checked}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </label>
  );
}
