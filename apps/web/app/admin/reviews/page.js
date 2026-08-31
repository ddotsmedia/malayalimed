import ReviewModeration from './ReviewModeration';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Reviews · Admin' };

export default function AdminReviewsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Review Moderation</h1>
      <ReviewModeration />
    </div>
  );
}
