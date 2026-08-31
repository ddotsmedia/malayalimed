// ReviewStats — rating breakdown bars (pure, server-renderable).
import RatingDisplay from '@/components/RatingDisplay';

export default function ReviewStats({ stats, ml = true }) {
  const total = Number(stats?.count) || 0;
  const rows = [5, 4, 3, 2, 1];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{Number(stats?.avg || 0).toFixed(1)}</div>
          <RatingDisplay avg={stats?.avg} />
          <div className="mt-1 text-xs text-gray-500">{total} {ml ? 'റിവ്യൂകൾ' : 'reviews'}</div>
        </div>
        <div className="flex-1 space-y-1">
          {rows.map((star) => {
            const c = Number(stats?.[`s${star}`]) || 0;
            const pct = total ? Math.round((c / total) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-gray-600">{star}</span>
                <span className="text-amber-500">★</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <span className="block h-full bg-amber-400" style={{ width: `${pct}%` }} />
                </span>
                <span className="w-6 text-right text-gray-500">{c}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
