'use client';
export default function GroupCard({ g, href }) {
  return <a href={href} className="rounded-2xl border border-gray-200 bg-white p-4 hover:border-brand">
    <h3 className="font-semibold text-gray-900">{g.name}</h3>
    <p className="text-xs text-gray-500">{g.type} · {g.member_count || 0} members</p>
  </a>;
}
