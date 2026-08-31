export default function BadgeCard({ badge, onClick }) {
  const { icon, label, unlocked, unlockedAt } = badge;
  return (
    <button onClick={() => onClick(badge)} className={`flex flex-col items-center gap-1 rounded-2xl border p-4 text-center transition ${unlocked ? 'border-brand/40 bg-white' : 'border-gray-200 bg-gray-50'}`}>
      <span className={`text-4xl ${unlocked ? '' : 'opacity-30 grayscale'}`}>{icon}</span>
      <span className={`text-sm font-semibold ${unlocked ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
      {unlocked
        ? <span className="text-[10px] text-brand">Unlocked {String(unlockedAt).slice(0, 10)}</span>
        : <span className="text-[10px] text-gray-400">Locked</span>}
    </button>
  );
}
