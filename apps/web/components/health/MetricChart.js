'use client';
import { useEffect, useState, useCallback } from 'react';
import AdminChart from '@/components/admin/AdminChart';
import TrendBadge from './TrendBadge';

const RANGES = [7, 30, 90];

export default function MetricChart({ type, label, refreshKey, invert = false }) {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);

  const load = useCallback(async () => {
    const r = await fetch(`/api/health-metrics/trends?type=${type}&days=${days}`, { credentials: 'same-origin' });
    const j = await r.json().catch(() => ({}));
    if (r.ok) setData(j.data);
  }, [type, days]);

  useEffect(() => { load(); }, [load, refreshKey]);

  const empty = !data || data.values.length === 0;
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
        <div className="flex gap-1 text-xs">
          {RANGES.map((d) => <button key={d} onClick={() => setDays(d)} className={`rounded px-2 py-0.5 ${days === d ? 'bg-brand text-white' : 'text-gray-500'}`}>{d}d</button>)}
        </div>
      </div>
      {empty ? <p className="py-8 text-center text-sm text-gray-400">No data yet</p> : (
        <>
          <AdminChart type="line" height={200} series={[{ name: label, data: data.values }]} categories={data.dates.map((d) => d.slice(5))} />
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
            <span>avg <b>{data.avg}</b></span><span>min <b>{data.min}</b></span><span>max <b>{data.max}</b></span>
            <span className="ml-auto">trend <TrendBadge delta={data.trend} invert={invert} /></span>
          </div>
        </>
      )}
    </div>
  );
}
