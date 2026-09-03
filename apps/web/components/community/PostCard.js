'use client';
export default function PostCard({ p }) {
  return <div className="rounded-xl border border-gray-200 bg-white p-3 text-sm"><p className="text-gray-700">{p.content}</p><p className="text-xs text-gray-400">{String(p.created_at).slice(0, 10)}</p></div>;
}
