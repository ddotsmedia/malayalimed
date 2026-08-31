'use client';

export default function ContentCard({ item, locale = 'ml' }) {
  const href = item.type === 'wellness' ? `/${locale}/wellness/${item.slug}` : `/${locale}/news/${item.slug}`;
  function share() {
    const url = typeof window !== 'undefined' ? window.location.origin + href : href;
    if (navigator.share) navigator.share({ title: item.title, url }).catch(() => {});
    else window.open(`https://wa.me/?text=${encodeURIComponent(item.title + ' ' + url)}`, '_blank');
  }
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand capitalize">{item.category}</span>
        <button onClick={share} className="text-xs text-gray-400 hover:text-brand">Share</button>
      </div>
      <a href={href}>
        <h3 className="mt-2 font-semibold text-gray-900">{item.title}</h3>
        {item.excerpt && <p className="mt-1 line-clamp-3 text-sm text-gray-600">{item.excerpt}</p>}
      </a>
      <a href={href} className="mt-2 inline-block text-xs font-semibold text-brand">Read more →</a>
    </article>
  );
}
