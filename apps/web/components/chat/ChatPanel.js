'use client';
import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

const GREETING = { role: 'assistant', text: 'Hi! I can share general health information (not a diagnosis). Ask me anything, e.g. “What is diabetes?” or “Which doctor for skin problems?”' };

export default function ChatPanel({ locale = 'ml', compact = false }) {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function send(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput(''); setBusy(true);
    setMessages((m) => [...m.slice(-19), { role: 'user', text }]);
    try {
      const r = await fetch('/api/ai/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: text }) });
      const j = await r.json();
      if (r.ok) setMessages((m) => [...m.slice(-19), { role: 'assistant', text: j.data.message, links: j.data.links, source: j.data.source }]);
      else setMessages((m) => [...m.slice(-19), { role: 'assistant', text: j.errors?.[0] || 'Something went wrong.' }]);
    } catch { setMessages((m) => [...m.slice(-19), { role: 'assistant', text: 'Network error. Please try again.' }]); }
    setBusy(false);
  }

  return (
    <div className={`flex flex-col ${compact ? 'h-96' : 'h-[70vh]'} rounded-2xl border border-gray-200 bg-white`}>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.map((m, i) => <ChatMessage key={i} msg={m} locale={locale} />)}
        {busy && <p className="text-xs text-gray-400">typing…</p>}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-gray-100 p-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a health question…" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button disabled={busy} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Send</button>
      </form>
    </div>
  );
}
