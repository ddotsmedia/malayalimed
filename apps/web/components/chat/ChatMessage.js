export default function ChatMessage({ msg, locale = 'ml' }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${isUser ? 'bg-brand text-white' : 'bg-gray-100 text-gray-800'}`}>
        <p className="whitespace-pre-wrap">{msg.text}</p>
        {!isUser && msg.links?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {msg.links.map((l) => (
              <a key={l.slug} href={`/${locale}/doctors?q=${encodeURIComponent(l.specialty)}`} className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-brand">
                {l.specialty} ({l.doctorCount})
              </a>
            ))}
          </div>
        )}
        {!isUser && msg.source === 'ai' && <span className="mt-1 block text-[10px] text-gray-400">AI-generated</span>}
      </div>
    </div>
  );
}
