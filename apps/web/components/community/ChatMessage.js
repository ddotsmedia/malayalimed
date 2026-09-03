'use client';
export default function ChatMessage({ msg }) {
  return <div className="rounded-lg bg-gray-50 p-3 text-sm"><p className="text-xs text-gray-500">{String(msg.created_at).slice(0, 10)}</p><p className="text-gray-800">{msg.message}</p></div>;
}
