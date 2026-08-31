'use client';
import { use, useState } from 'react';

export default function CallPage({ params }) {
  const { locale, peer } = use(params);
  const [room, setRoom] = useState(null);
  async function start() {
    const r = await fetch(`/api/messages/${peer}/start-call`, { method: 'POST' });
    const j = await r.json();
    if (r.ok) setRoom(j.data.room);
  }
  return (
    <div className="mx-auto max-w-2xl space-y-3">
      <a href={`/${locale}/patient/messages/${peer}`} className="text-sm text-brand">← Back to chat</a>
      <h1 className="text-xl font-bold text-gray-900">Voice Call</h1>
      {room
        ? <iframe src={`https://meet.jit.si/${room}#config.startWithVideoMuted=true`} allow="camera; microphone; fullscreen" className="h-[70vh] w-full rounded-2xl border border-gray-200" />
        : <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center"><button onClick={start} className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white">Start voice call</button></div>}
    </div>
  );
}
