export default function AIHealthTip({ tip }) {
  if (!tip) return null;
  return (
    <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">💡</span>
        <h2 className="text-sm font-bold text-gray-900">Health tip of the day</h2>
        {tip.source === 'ai' && <span className="rounded-full bg-brand/10 px-2 text-[10px] font-semibold text-brand">AI</span>}
      </div>
      <p className="mt-1 text-sm text-gray-700">{tip.tip}</p>
    </div>
  );
}
