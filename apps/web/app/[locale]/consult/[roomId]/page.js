'use client';
import { use } from 'react';

export default function ConsultPage({ params }) {
  const { locale, roomId } = use(params);
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold text-gray-900">Telehealth Consultation</h1>
      <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
        <iframe src={`https://meet.jit.si/mm-${roomId}`} allow="camera; microphone; fullscreen; display-capture" className="h-[70vh] w-full rounded-2xl border border-gray-200" />
        <aside className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-bold text-gray-900">Session</h2>
          <a href={`/${locale}/consult/${roomId}/follow-up`} className="block rounded-lg bg-brand px-3 py-2 text-center text-sm font-semibold text-white">Schedule follow-up</a>
          <a href={`/${locale}/consult/${roomId}/prescription`} className="block rounded-lg border border-gray-300 px-3 py-2 text-center text-sm">Prescription</a>
          <p className="text-xs text-gray-400">Vitals appear here when recorded during the session.</p>
        </aside>
      </div>
    </div>
  );
}
