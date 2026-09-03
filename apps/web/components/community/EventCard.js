'use client';
export default function EventCard({ e }) {
  return <div className="rounded-2xl border border-gray-200 bg-white p-4"><p className="font-semibold text-gray-900">{e.title}</p><p className="text-xs text-gray-500">📅 {e.event_date} · {e.event_type}</p><p className="mt-1 text-sm text-gray-700">{e.description}</p></div>;
}
