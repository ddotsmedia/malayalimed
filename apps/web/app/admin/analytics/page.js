import AnalyticsClient from './AnalyticsClient';

export const dynamic = 'force-dynamic';

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Analytics</h1>
      <AnalyticsClient />
    </div>
  );
}
