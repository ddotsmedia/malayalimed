import FetchTable from '@/components/portal/FetchTable';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'IoT Monitoring' };
export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">IoT Device Monitoring</h1>
      <FetchTable url="/api/admin/iot-devices" empty="No devices registered." columns={[
        { key: 'patient', label: 'Patient' },
        { key: 'device_name', label: 'Device' },
        { key: 'is_active', label: 'Active', render: (r) => r.is_active ? '✓' : '✗' },
        { key: 'last_sync', label: 'Last sync', render: (r) => r.last_sync ? String(r.last_sync).slice(0, 16).replace('T', ' ') : '—' },
      ]} />
    </div>
  );
}
