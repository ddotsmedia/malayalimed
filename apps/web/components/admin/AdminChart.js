'use client';
import dynamic from 'next/dynamic';

// react-apexcharts is browser-only; load it client-side with no SSR.
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false, loading: () => <ChartSkeleton /> });

function ChartSkeleton() {
  return <div className="flex h-[260px] items-center justify-center text-sm text-slate-400">Loading chart…</div>;
}

const BRAND = ['#0d9488', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6', '#22c55e'];

/**
 * @param {'line'|'area'|'bar'|'donut'|'pie'} type
 * @param {array} series  ApexCharts series (or number[] for pie/donut)
 * @param {object} options extra ApexCharts options (merged)
 */
export default function AdminChart({ type = 'line', series = [], categories = [], labels = [], height = 260, title, options = {} }) {
  const base = {
    chart: { toolbar: { show: false }, fontFamily: 'inherit', foreColor: '#64748b' },
    colors: BRAND,
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    grid: { borderColor: '#e2e8f0', strokeDashArray: 4 },
    xaxis: { categories },
    labels,
    legend: { position: 'bottom' },
    tooltip: { theme: 'light' },
    ...options,
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      {title && <h3 className="mb-2 text-sm font-semibold text-slate-700">{title}</h3>}
      <ReactApexChart type={type} series={series} options={base} height={height} />
    </div>
  );
}
