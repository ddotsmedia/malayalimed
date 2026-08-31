'use client';
import { useState } from 'react';
import { useNotifications } from '@/hooks/admin/queries';

// Polls /api/admin/notifications every 30s (no WebSocket layer available).
export default function NotificationBell() {
  const { data } = useNotifications();
  const [open, setOpen] = useState(false);
  const items = [
    { label: 'Pending doctor verifications', value: data?.doctors_pending, href: '/admin/doctors?status=pending' },
    { label: 'Reviews to moderate', value: data?.reviews_pending, href: '/admin/reviews?status=pending' },
    { label: 'New users today', value: data?.users_today, href: '/admin/users' },
    { label: 'Appointments today', value: data?.appts_today, href: '/admin/appointments' },
  ];
  const total = (data?.doctors_pending || 0) + (data?.reviews_pending || 0);
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Notifications">
        <span className="text-lg">🔔</span>
        {total > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">{total > 99 ? '99+' : total}</span>}
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          {items.map((it) => (
            <a key={it.label} href={it.href} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-slate-50">
              <span className="text-slate-600">{it.label}</span>
              <span className="rounded-full bg-brand/10 px-2 text-xs font-bold text-brand">{it.value ?? 0}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
