function Sparkline({ data = [], color = '#0d9488' }) {
  if (!data.length) return <span className="text-xs text-gray-400">no data</span>;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / Math.max(1, data.length - 1)) * 100},${28 - ((v - min) / range) * 26}`).join(' ');
  return <svg viewBox="0 0 100 28" className="h-8 w-full" preserveAspectRatio="none"><polyline points={pts} fill="none" stroke={color} strokeWidth="2" /></svg>;
}

function Bars({ data = [], color = '#0ea5e9' }) {
  if (!data.length) return <span className="text-xs text-gray-400">no data</span>;
  const max = Math.max(...data) || 1;
  return (
    <div className="flex h-8 items-end gap-0.5">
      {data.map((v, i) => <span key={i} className="flex-1 rounded-t" style={{ height: `${(v / max) * 100}%`, background: color }} />)}
    </div>
  );
}

export default function HealthMetricsWidget({ metrics, locale = 'ml' }) {
  const bp = metrics.blood_pressure;
  const bpStatus = bp ? (bp.systolic >= 140 || bp.diastolic >= 90 ? 'High' : bp.systolic < 90 ? 'Low' : 'Normal') : null;
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">Weight</p>
        <p className="text-lg font-bold text-gray-900">{metrics.weight ? `${metrics.weight.latest} ${metrics.weight.unit || 'kg'}` : '—'}</p>
        {metrics.weight && <Sparkline data={metrics.weight.series} />}
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">Steps</p>
        <p className="text-lg font-bold text-gray-900">{metrics.steps ? metrics.steps.latest : '—'}</p>
        {metrics.steps && <Bars data={metrics.steps.series} />}
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">Blood Pressure</p>
        <p className="text-lg font-bold text-gray-900">{bp ? `${bp.systolic}/${bp.diastolic}` : '—'}</p>
        {bpStatus && <span className={`text-xs font-semibold ${bpStatus === 'Normal' ? 'text-green-600' : 'text-red-500'}`}>{bpStatus}</span>}
      </div>
    </div>
  );
}
