export default function AlertBanner({ severity = 'high', children }) {
  const cls = severity === 'high' ? 'border-red-300 bg-red-50 text-red-800' : 'border-amber-300 bg-amber-50 text-amber-800';
  return <div className={`rounded-xl border p-3 text-sm ${cls}`}>⚠️ {children}</div>;
}
