'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

export default function CommunityFeed({ locale }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const sentinel = useRef(null);

  const load = useCallback(async () => {
    if (loading || done) return;
    setLoading(true);
    const r = await fetch(`/api/community/posts?page=${page}`);
    const j = await r.json().catch(() => ({}));
    const batch = j.data || [];
    setItems((p) => [...p, ...batch]);
    if (batch.length < 20) setDone(true); else setPage((p) => p + 1);
    setLoading(false);
  }, [page, loading, done]);
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);
  useEffect(() => {
    const el = sentinel.current; if (!el) return;
    const obs = new IntersectionObserver((e) => { if (e[0].isIntersecting) load(); }, { rootMargin: '200px' });
    obs.observe(el); return () => obs.disconnect();
  }, [load]);

  return (
    <div className="space-y-3">
      <a href={`/${locale}/community/new-post`} className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">+ New post</a>
      {items.map((p) => (
        <a key={p.id} href={`/${locale}/community/${p.id}`} className="block rounded-2xl border border-gray-200 bg-white p-4 hover:border-brand">
          <div className="flex items-center justify-between"><span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand capitalize">{p.category}</span><span className="text-xs text-gray-400">♥ {p.likes}</span></div>
          <h3 className="mt-1 font-semibold text-gray-900">{p.title}</h3>
          <p className="line-clamp-2 text-sm text-gray-600">{p.content}</p>
          <p className="mt-1 text-xs text-gray-400">{p.author} · {String(p.created_at).slice(0, 10)}</p>
        </a>
      ))}
      {items.length === 0 && !loading && <p className="text-sm text-gray-400">No posts yet. Be the first!</p>}
      {loading && <p className="text-center text-sm text-gray-400">Loading…</p>}
      {!done && <div ref={sentinel} className="h-6" />}
    </div>
  );
}
