'use client';

function CheckGroup({ title, options, selected, onToggle, labelKey }) {
  if (!options?.length) return null;
  return (
    <div className="border-b border-gray-100 pb-3">
      <p className="mb-1 text-xs font-bold uppercase text-gray-400">{title}</p>
      <div className="space-y-1">
        {options.map((o) => {
          const val = labelKey ? o.id : o;
          const label = labelKey ? o[labelKey] : o;
          return (
            <label key={val} className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={selected.includes(String(val))} onChange={() => onToggle(String(val))} />
              <span className="capitalize">{label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function JobFilters({ filters, options, set, clear }) {
  return (
    <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900">Advanced Search</h2>
        <button onClick={clear} className="text-xs font-semibold text-brand">Clear</button>
      </div>
      <div>
        <p className="mb-1 text-xs font-bold uppercase text-gray-400">Salary (₹)</p>
        <div className="flex gap-2">
          <input type="number" value={filters.salary_min || ''} onChange={(e) => set('salary_min', e.target.value)} placeholder="Min" className="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm" />
          <input type="number" value={filters.salary_max || ''} onChange={(e) => set('salary_max', e.target.value)} placeholder="Max" className="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm" />
        </div>
      </div>
      <CheckGroup title="Specialty" options={options.specialties} labelKey="name_en" selected={filters.specialty ? [filters.specialty] : []} onToggle={(v) => set('specialty', filters.specialty === v ? '' : v)} />
      <CheckGroup title="District" options={options.districts} labelKey="name_en" selected={filters.district ? [filters.district] : []} onToggle={(v) => set('district', filters.district === v ? '' : v)} />
      <CheckGroup title="Experience" options={options.experience_levels} selected={filters.experience ? [filters.experience] : []} onToggle={(v) => set('experience', filters.experience === v ? '' : v)} />
      <CheckGroup title="Work Mode" options={options.work_modes} selected={filters.work_mode ? [filters.work_mode] : []} onToggle={(v) => set('work_mode', filters.work_mode === v ? '' : v)} />
      <CheckGroup title="Employment" options={options.employment_types} selected={filters.employment_type ? [filters.employment_type] : []} onToggle={(v) => set('employment_type', filters.employment_type === v ? '' : v)} />
    </div>
  );
}
