'use client';
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useDashboardStore } from '@/lib/store/dashboardStore';
import DashboardKPIs from '@/components/dashboard/DashboardKPIs';
import DashboardQuickActions from '@/components/dashboard/DashboardQuickActions';
import HealthMetricsWidget from '@/components/dashboard/HealthMetricsWidget';
import AppointmentTimeline from '@/components/dashboard/AppointmentTimeline';
import AIHealthTip from '@/components/dashboard/AIHealthTip';

function Inner({ locale }) {
  const setData = useDashboardStore((s) => s.setData);
  const { data, isLoading, error } = useQuery({
    queryKey: ['patient-dashboard'],
    queryFn: async () => {
      const r = await fetch('/api/patient/dashboard', { credentials: 'same-origin' });
      const j = await r.json();
      if (!r.ok) throw new Error(j.errors?.[0] || 'Failed');
      return j.data;
    },
    staleTime: 300000,
    refetchOnWindowFocus: true,
  });
  useEffect(() => { if (data) setData(data); }, [data, setData]);

  if (isLoading) return <p className="text-sm text-gray-500">Loading dashboard…</p>;
  if (error) return <p className="text-sm text-red-600">{error.message}</p>;

  return (
    <div className="space-y-4">
      <DashboardKPIs kpis={data.kpis} locale={locale} />
      <DashboardQuickActions locale={locale} />
      <AIHealthTip tip={data.tip} />
      <HealthMetricsWidget metrics={data.metrics} locale={locale} />
      <AppointmentTimeline appointments={data.appointments} locale={locale} />
    </div>
  );
}

export default function PatientDashboard({ locale = 'ml' }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: 1 } } }));
  return <QueryClientProvider client={client}><Inner locale={locale} /></QueryClientProvider>;
}
