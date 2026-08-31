export default function TrendBadge({ delta, invert = false }) {
  const d = Number(delta) || 0;
  if (d === 0) return <span className="text-xs text-slate-400">→ 0</span>;
  const up = d > 0;
  const good = invert ? !up : up;
  return (
    <span className={`text-xs font-semibold ${good ? 'text-green-600' : 'text-red-500'}`}>
      {up ? '↑' : '↓'} {Math.abs(d)}
    </span>
  );
}
