import { fmtCurrency, fmtDate } from '@/lib/formatters';

export default function JobCard({ job: j }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">{j.title}</h3>
          <p className="text-sm text-gray-600">{j.employer}</p>
        </div>
        <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">{j.job_type}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 text-xs text-gray-500">
        {j.district_en && <span>📍 {j.district_en}</span>}
        {j.specialty_en && <span>{j.specialty_en}</span>}
        {(j.salary_min || j.salary_max) && <span className="font-medium text-gray-700">{fmtCurrency(j.salary_min)}–{fmtCurrency(j.salary_max)}</span>}
        <span className="ml-auto text-gray-400">{fmtDate(j.posted_at)}</span>
      </div>
    </div>
  );
}
