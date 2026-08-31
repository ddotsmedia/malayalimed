import MessageInbox from '@/components/messaging/MessageInbox';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Patient Messages' };
export default function Page() {
  return <div className="space-y-4"><h1 className="text-xl font-bold text-slate-900">Patient Messages</h1><MessageInbox basePath="/ml/patient/messages" /></div>;
}
