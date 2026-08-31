import ConditionCard from './ConditionCard';

export default function ResultsPanel({ result, locale = 'ml' }) {
  if (!result) return null;
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
        ⚠️ {result.disclaimer}
      </div>
      {result.source === 'ai'
        ? <p className="text-xs text-gray-400">AI-generated educational content.</p>
        : <p className="text-xs text-gray-400">Rule-based educational guidance.</p>}
      <div className="space-y-2">
        {result.conditions.map((c, i) => <ConditionCard key={i} condition={c} locale={locale} />)}
      </div>
    </div>
  );
}
