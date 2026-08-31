// Charts.js — dependency-free SVG charts.
export function LineChart({ series = [], stroke = '#0d9488', label }) {
  if (!series.length) return <p className="text-sm text-slate-400">No data.</p>;
  const W = 600, H = 90, pad = 4;
  const max = Math.max(1, ...series.map((p) => p.n));
  const step = series.length > 1 ? (W - pad * 2) / (series.length - 1) : 0;
  const pts = series.map((p, i) => `${pad + i * step},${H - pad - (p.n / max) * (H - pad * 2)}`).join(' ');
  return (
    <div>
      {label && <p className="mb-1 text-xs font-semibold text-slate-500">{label}</p>}
      <svg viewBox={`0 0 ${W} ${H}`} className="h-24 w-full" preserveAspectRatio="none" role="img" aria-label={label || 'trend'}>
        <polyline points={pts} fill="none" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
