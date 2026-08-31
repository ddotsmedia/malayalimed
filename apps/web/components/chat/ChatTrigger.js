'use client';
import { useState } from 'react';
import ChatPanel from './ChatPanel';

export default function ChatTrigger({ locale = 'ml' }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen((o) => !o)} aria-label="AI assistant"
        className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl text-white shadow-lg">
        {open ? '✕' : '💬'}
      </button>
      {open && (
        <div className="fixed bottom-20 right-4 z-40 w-[92vw] max-w-sm">
          <div className="mb-1 rounded-t-xl bg-brand px-3 py-2 text-sm font-semibold text-white">Health Assistant · not a diagnosis</div>
          <ChatPanel locale={locale} compact />
        </div>
      )}
    </>
  );
}
