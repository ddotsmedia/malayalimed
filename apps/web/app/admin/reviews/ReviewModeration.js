'use client';
import { useState } from 'react';
import { useReviews, useAdminMutation, apiSend } from '@/hooks/admin/queries';
import { useAdminStore } from '@/lib/store/adminStore';

const STATUSES = ['', 'pending', 'approved', 'flagged', 'rejected'];
const badge = { approved: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700', flagged: 'bg-orange-100 text-orange-700', rejected: 'bg-red-100 text-red-700' };

function csv(rows) {
  const head = ['reviewer', 'entity_type', 'entity', 'rating', 'status', 'body', 'created_at'];
  const body = rows.map((r) => [r.reviewer_name, r.entity_type, r.entity_name, r.rating, r.status, (r.body || '').replace(/"/g, "'"), r.created_at].map((v) => `"${v ?? ''}"`).join(','));
  return [head.join(','), ...body].join('\n');
}

export default function ReviewModeration() {
  const filters = useAdminStore((s) => s.filters.reviews || { status: 'pending' });
  const setFilters = useAdminStore((s) => s.setFilters);
  const { data: rows = [], isLoading, error } = useReviews(filters);
  const [sel, setSel] = useState([]);
  const mutate = useAdminMutation(({ id, status }) => apiSend(`/api/admin/reviews/${id}`, 'PUT', { status }), ['reviews', 'dashboard', 'notifications']);
  const del = useAdminMutation((id) => apiSend(`/api/admin/reviews/${id}`, 'DELETE'), ['reviews', 'notifications']);

  const toggle = (id) => setSel((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const bulk = (status) => { sel.forEach((id) => mutate.mutate({ id, status })); setSel([]); };
  const exportCsv = () => {
    const blob = new Blob([csv(rows)], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'reviews.csv'; a.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <select value={filters.status || ''} onChange={(e) => setFilters('reviews', { status: e.target.value })} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
          {STATUSES.map((s) => <option key={s} value={s}>{s || 'All statuses'}</option>)}
        </select>
        <select value={filters.rating || ''} onChange={(e) => setFilters('reviews', { rating: e.target.value })} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
          <option value="">All ratings</option>{[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} star</option>)}
        </select>
        <input defaultValue={filters.q || ''} onKeyDown={(e) => e.key === 'Enter' && setFilters('reviews', { q: e.target.value })} placeholder="Search reviewer/text…" className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
        <button onClick={exportCsv} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm">Export CSV</button>
        {sel.length > 0 && (
          <span className="ml-auto flex gap-2">
            <button onClick={() => bulk('approved')} className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white">Approve {sel.length}</button>
            <button onClick={() => bulk('rejected')} className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white">Reject {sel.length}</button>
          </span>
        )}
      </div>

      {isLoading ? <p className="text-sm text-slate-500">Loading…</p> : error ? <p className="text-sm text-red-600">{error.message}</p> : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr><th className="px-3 py-2"></th><th className="px-3 py-2">Reviewer</th><th className="px-3 py-2">Entity</th><th className="px-3 py-2">Rating</th><th className="px-3 py-2">Review</th><th className="px-3 py-2">Status</th><th className="px-3 py-2 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 ? <tr><td colSpan={7} className="px-3 py-6 text-center text-slate-400">No reviews.</td></tr> :
                rows.map((r) => (
                  <tr key={r.id} className="align-top hover:bg-slate-50">
                    <td className="px-3 py-2"><input type="checkbox" checked={sel.includes(r.id)} onChange={() => toggle(r.id)} /></td>
                    <td className="px-3 py-2">{r.reviewer_name}</td>
                    <td className="px-3 py-2"><span className="text-xs text-slate-400">{r.entity_type}</span><br />{r.entity_name || '—'}</td>
                    <td className="px-3 py-2 text-amber-500">{'★'.repeat(r.rating)}</td>
                    <td className="max-w-xs px-3 py-2">{r.title && <p className="font-semibold text-slate-800">{r.title}</p>}<p className="text-slate-600">{r.body}</p></td>
                    <td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge[r.status] || 'bg-slate-100'}`}>{r.status}</span></td>
                    <td className="whitespace-nowrap px-3 py-2 text-right">
                      <button onClick={() => mutate.mutate({ id: r.id, status: 'approved' })} className="mr-1 rounded bg-green-600 px-2 py-1 text-xs text-white">✓</button>
                      <button onClick={() => mutate.mutate({ id: r.id, status: 'flagged' })} className="mr-1 rounded bg-orange-500 px-2 py-1 text-xs text-white">⚑</button>
                      <button onClick={() => mutate.mutate({ id: r.id, status: 'rejected' })} className="mr-1 rounded bg-red-600 px-2 py-1 text-xs text-white">✕</button>
                      <button onClick={() => window.confirm('Delete review?') && del.mutate(r.id)} className="rounded bg-slate-700 px-2 py-1 text-xs text-white">🗑</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
