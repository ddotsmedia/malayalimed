import FetchTable from '@/components/portal/FetchTable';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Vital Alerts' };
export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Vital Alerts</h1>
      <FetchTable url="/api/vital-alerts" empty="No alerts — your readings are within range." columns={[
        { key: 'alert_type', label: 'Metric' },
        { key: 'value', label: 'Value' },
        { key: 'threshold', label: 'Threshold' },
        { key: 'severity', label: 'Severity' },
        { key: 'created_at', label: 'When', render: (r) => String(r.created_at).slice(0, 16).replace('T', ' ') },
      ]} />
    </div>
  );
}
