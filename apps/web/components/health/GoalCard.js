export default function GoalCard({ goal }) {
  const target = Number(goal.target_value) || 0;
  const current = Number(goal.current_value) || 0;
  const pct = target ? Math.min(100, Math.round((current / target) * 100)) : 0;
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold capitalize text-gray-800">{String(goal.goal_type).replace('_', ' ')}</span>
        <span className="text-xs text-gray-500">{current}/{target} {goal.unit}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-right text-xs font-semibold text-brand">{pct}%</p>
    </div>
  );
}
