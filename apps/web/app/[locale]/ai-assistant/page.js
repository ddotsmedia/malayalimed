import { resolveLocale } from '@/lib/i18n';
import ChatPanel from '@/components/chat/ChatPanel';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'AI Health Assistant' };

export default async function AIAssistantPage(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  return (
    <div className="mx-auto max-w-2xl space-y-3">
      <h1 className="text-xl font-bold text-gray-900">AI Health Assistant</h1>
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
        ⚠️ Educational information only — not a medical diagnosis. Emergency: Kerala 112 · Ambulance 108.
      </div>
      <ChatPanel locale={locale} />
    </div>
  );
}
