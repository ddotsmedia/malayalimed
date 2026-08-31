'use client';
import { useAuditLogs } from '@/hooks/admin/queries';
import { useAdminStore } from '@/lib/store/adminStore';

export default function AuditLogView() {
  const filters = useAdminStore((s) => s.filters.audit || {});
  const setFilters = useAdminStore((s) => s.setFilters);
  const { data: rows = [], isLoading, error } = useAuditLogs(filters);

  const exportCsv = () => {
    const head = 'time,actor,action,entity_type,entity_id,ip';
    const body = rows.map((r) => [r.created_at, r.actor_email, r.action, r.entity_type, r.entity_id, r.ip_address].map((v) => `"${v ?? ''}"`).join(','));
    const blob = new Blob([[head, ...body].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'audit-logs.csv'; a.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input defaultValue={filters.action || ''} onKeyDown={(e) => e.key === 'Enter' && setFilters('audit', { action: e.target.value })} placeholder="action (e.g. review.approved)" className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
        <input defaultValue={filters.entityType || ''} onKeyDown={(e) => e.key === 'Enter' && setFilters('audit', { entityType: e.target.value })} placeholder="entity type" className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
        <input defaultValue={filters.actorEmail || ''} onKeyDown={(e) => e.key === 'Enter' && setFilters('audit', { actorEmail: e.target.value })} placeholder="admin email" className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
        <button onClick={exportCsv} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm">Export CSV</button>
      </div>
      {isLoading ? <p className="text-sm text-slate-500">Loading…</p> : error ? <p className="text-sm text-red-600">{error.message}</p> : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr><th className="px-3 py-2">Time</th><th className="px-3 py-2">Admin</th><th className="px-3 py-2">Action</th><th className="px-3 py-2">Entity</th><th className="px-3 py-2">IP</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 ? <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-400">No log entries.</td></tr> :
                rows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-500">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="px-3 py-2">{r.actor_email || '—'}</td>
                    <td className="px-3 py-2"><span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs">{r.action}</span></td>
                    <td className="px-3 py-2 text-xs text-slate-500">{r.entity_type} {r.entity_id ? `· ${String(r.entity_id).slice(0, 8)}` : ''}</td>
                    <td className="px-3 py-2 text-xs text-slate-400">{r.ip_address || '—'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
