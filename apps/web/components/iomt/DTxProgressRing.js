export default function DTxProgressRing({ pct = 0, size = 88 }) {
  const r = (size - 12) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#0d9488" strokeWidth="8" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(100, pct) / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" className="fill-gray-900 text-sm font-bold">{pct}%</text>
    </svg>
  );
}
