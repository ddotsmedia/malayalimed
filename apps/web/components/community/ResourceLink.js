'use client';
export default function ResourceLink({ r }) {
  return <a href={r.url_or_file_key} target="_blank" rel="noopener" className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 text-sm hover:border-brand">
    <span className="font-medium text-gray-800">{r.title}</span><span className="text-brand">→</span>
  </a>;
}
