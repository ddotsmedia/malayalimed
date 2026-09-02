'use client';
import { useEffect, useState } from 'react';
import AdminChart from '@/components/admin/AdminChart';
export default function SuccessRates() {
  const [rows, setRows] = useState([]);
  useEffect(() => { fetch('/api/procedures/success-rates').then((r) => r.json()).then((j) => setRows(j.data || [])); }, []);
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Procedure Success Rates</h1>
      {rows.length > 0 && <AdminChart type="bar" title="Success rate (%)" height={360} series={[{ name: '%', data: rows.map((r) => Number(r.success_rate)) }]} categories={rows.map((r) => r.procedure_name)} options={{ plotOptions: { bar: { horizontal: true } }, xaxis: { max: 100 } }} />}
    </div>
  );
}
