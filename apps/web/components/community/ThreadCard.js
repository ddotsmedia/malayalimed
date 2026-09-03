'use client';
export default function ThreadCard({ t, href }) {
  return <a href={href} className="rounded-2xl border border-gray-200 bg-white p-4 hover:border-brand">
    <h3 className="font-semibold text-gray-900">{t.title}</h3>
    <p className="text-xs text-gray-500">{t.specialty || 'General'} · {t.thread_type} · {t.views} views</p>
  </a>;
}
