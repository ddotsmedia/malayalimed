'use client';
import { useEffect, useState } from 'react';
import ListCardItem from '@/components/common/ListCardItem';

export default function MessageInbox({ basePath }) {
  const [rows, setRows] = useState(null);
  useEffect(() => { fetch('/api/messages/threads').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => setRows([])); }, []);
  if (!rows) return <p className="text-sm text-gray-500">Loading…</p>;
  if (rows.length === 0) return <p className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">No conversations yet.</p>;
  return (
    <div className="space-y-2">
      {rows.map((t) => (
        <ListCardItem key={t.user_id} href={`${basePath}/${t.user_id}`} title={t.full_name || 'User'}
          subtitle={`Last: ${String(t.last_at).slice(0, 16).replace('T', ' ')}`}
          badge={t.unread > 0 ? <span className="rounded-full bg-red-600 px-2 text-[10px] font-bold text-white">{t.unread}</span> : null} />
      ))}
    </div>
  );
}
