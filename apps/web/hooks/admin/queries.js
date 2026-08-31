'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

async function get(url) {
  const r = await fetch(url, { credentials: 'same-origin' });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.errors?.[0] || `HTTP ${r.status}`);
  return j.data;
}
function qs(params = {}) {
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v != null && v !== '') s.set(k, v); });
  const str = s.toString();
  return str ? `?${str}` : '';
}

// Near-real-time is done via polling (refetchInterval) — no WebSocket layer exists.
export const useAdminDashboard = () => useQuery({ queryKey: ['admin', 'dashboard'], queryFn: () => get('/api/admin/dashboard'), refetchInterval: 60000 });
export const useNotifications = () => useQuery({ queryKey: ['admin', 'notifications'], queryFn: () => get('/api/admin/notifications'), refetchInterval: 30000 });
export const useAdminMe = () => useQuery({ queryKey: ['admin', 'me'], queryFn: () => get('/api/admin/auth/me') });
export const useDoctors = (f) => useQuery({ queryKey: ['admin', 'doctors', f], queryFn: () => get(`/api/admin/doctors${qs(f)}`) });
export const useHospitals = (f) => useQuery({ queryKey: ['admin', 'hospitals', f], queryFn: () => get(`/api/admin/hospitals${qs(f)}`) });
export const useAppointments = (f) => useQuery({ queryKey: ['admin', 'appointments', f], queryFn: () => get(`/api/admin/appointments${qs(f)}`), refetchInterval: 60000 });
export const useReviews = (f) => useQuery({ queryKey: ['admin', 'reviews', f], queryFn: () => get(`/api/admin/reviews${qs(f)}`) });
export const useUsers = (f) => useQuery({ queryKey: ['admin', 'users', f], queryFn: () => get(`/api/admin/users${qs(f)}`) });
export const useAnalytics = () => useQuery({ queryKey: ['admin', 'analytics'], queryFn: () => get('/api/admin/analytics') });
export const useAuditLogs = (f) => useQuery({ queryKey: ['admin', 'audit', f], queryFn: () => get(`/api/admin/audit-logs${qs(f)}`) });

// Generic mutation that invalidates the given query keys on success.
export function useAdminMutation(fn, invalidate = []) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => invalidate.forEach((key) => qc.invalidateQueries({ queryKey: ['admin', key] })),
  });
}

export async function apiSend(url, method, body) {
  const r = await fetch(url, { method, credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.errors?.[0] || `HTTP ${r.status}`);
  return j.data;
}
