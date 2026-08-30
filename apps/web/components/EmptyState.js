export default function EmptyState({ message = 'No data', icon = '📭', cta }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center">
      <div className="text-4xl">{icon}</div>
      <p className="mt-2 text-sm text-gray-500">{message}</p>
      {cta}
    </div>
  );
}
