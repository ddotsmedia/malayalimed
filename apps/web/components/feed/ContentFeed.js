'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import ContentCard from './ContentCard';

export default function ContentFeed({ locale = 'ml' }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const sentinel = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || done) return;
    setLoading(true);
    const r = await fetch(`/api/patient/feed?page=${page}`, { credentials: 'same-origin' });
    const j = await r.json().catch(() => ({}));
    const batch = j.data || [];
    setItems((prev) => [...prev, ...batch]);
    if (batch.length < 10) setDone(true); else setPage((p) => p + 1);
    setLoading(false);
  }, [page, loading, done]);

  useEffect(() => { loadMore(); /* initial */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) loadMore(); }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  return (
    <div className="space-y-3">
      {items.map((it, i) => <ContentCard key={`${it.type}-${it.slug}-${i}`} item={it} locale={locale} />)}
      {items.length === 0 && !loading && <p className="text-sm text-gray-400">No content yet.</p>}
      {loading && <p className="text-center text-sm text-gray-400">Loading…</p>}
      {!done && <div ref={sentinel} className="h-6" />}
      {done && items.length > 0 && <p className="text-center text-xs text-gray-400">You are all caught up.</p>}
    </div>
  );
}
