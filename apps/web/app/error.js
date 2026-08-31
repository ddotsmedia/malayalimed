'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => { console.error('route error:', error); }, [error]);
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <div className="text-4xl">⚠️</div>
      <h2 className="mt-3 text-lg font-bold text-slate-900">Something went wrong</h2>
      <p className="mt-1 text-sm text-slate-500">{error?.message || 'Unexpected error.'}</p>
      <div className="mt-4 flex justify-center gap-2">
        <button onClick={reset} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Retry</button>
        <a href="/ml" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600">Home</a>
      </div>
    </div>
  );
}
