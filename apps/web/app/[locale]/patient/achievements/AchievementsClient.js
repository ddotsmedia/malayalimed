'use client';
import { useEffect, useState } from 'react';
import BadgeCard from '@/components/achievements/BadgeCard';

export default function AchievementsClient() {
  const [data, setData] = useState(null);
  const [sel, setSel] = useState(null);

  useEffect(() => {
    fetch('/api/patient/achievements').then((r) => r.json()).then((j) => setData(j.data)).catch(() => {});
  }, []);

  if (!data) return <p className="text-sm text-gray-500">Loading…</p>;

  function share(badge) {
    const text = `I just earned the “${badge.label}” badge on MalayaliMed! ${badge.icon}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-bold text-brand">{data.unlockedCount}/{data.total}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full bg-brand transition-all" style={{ width: `${(data.unlockedCount / data.total) * 100}%` }} />
        </div>
        {data.nextMilestone && <p className="mt-2 text-xs text-gray-500">Next: {data.nextMilestone.icon} {data.nextMilestone.label} — {data.nextMilestone.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {data.badges.map((b) => <BadgeCard key={b.type} badge={b} onClick={setSel} />)}
      </div>

      {sel && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4" onClick={() => setSel(null)}>
          <div className="w-full max-w-xs space-y-3 rounded-2xl bg-white p-6 text-center" onClick={(e) => e.stopPropagation()} style={{ animation: 'pop .25s ease-out' }}>
            <div className="text-6xl">{sel.unlocked ? sel.icon : '🔒'}</div>
            <h3 className="text-lg font-bold text-gray-900">{sel.label}</h3>
            <p className="text-sm text-gray-600">{sel.description}</p>
            {sel.unlocked
              ? <button onClick={() => share(sel)} className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white">Share to WhatsApp</button>
              : <p className="text-xs text-gray-400">Complete the action to unlock this badge.</p>}
          </div>
          <style>{'@keyframes pop{from{transform:scale(.8);opacity:0}to{transform:scale(1);opacity:1}}'}</style>
        </div>
      )}
    </div>
  );
}
