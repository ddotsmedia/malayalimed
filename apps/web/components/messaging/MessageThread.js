'use client';
import { useEffect, useRef, useState } from 'react';

export default function MessageThread({ peer, locale = 'ml', showCall = true }) {
  const [data, setData] = useState({ messages: [], peer: null });
  const [text, setText] = useState('');
  const endRef = useRef(null);
  const load = () => fetch(`/api/messages/with/${peer}`).then((r) => r.json()).then((j) => setData(j.data || { messages: [] })).catch(() => {});
  useEffect(() => { load(); }, [peer]);
  useEffect(() => { endRef.current?.scrollIntoView(); }, [data]);

  async function send(e) {
    e.preventDefault();
    const t = text.trim(); if (!t) return;
    setText('');
    await fetch(`/api/messages/with/${peer}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: t }) });
    load();
  }
  return (
    <div className="flex h-[70vh] flex-col rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 p-3">
        <span className="font-semibold text-gray-900">{data.peer?.full_name || 'Conversation'}</span>
        {showCall && <a href={`/${locale}/patient/messages/${peer}/call`} className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white">📞 Call</a>}
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {data.messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender_id === peer ? 'justify-start' : 'justify-end'}`}>
            <span className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.sender_id === peer ? 'bg-gray-100 text-gray-800' : 'bg-brand text-white'}`}>{m.message_text}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-gray-100 p-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Send</button>
      </form>
    </div>
  );
}
