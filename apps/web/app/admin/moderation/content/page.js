import ModerationClient from './ModerationClient';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Content Moderation · Admin' };
export default function Page() {
  return <div className="space-y-4"><h1 className="text-xl font-bold text-slate-900">Content Moderation</h1><ModerationClient /></div>;
}
