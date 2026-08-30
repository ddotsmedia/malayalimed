import { fmtRating } from '@/lib/formatters';

export default function RatingDisplay({ avg = 0, count = 0, size = 'sm' }) {
  const n = Math.round(Number(avg) || 0);
  const cls = size === 'lg' ? 'text-lg' : 'text-sm';
  return (
    <span className={`inline-flex items-center gap-1 ${cls}`}>
      <span className="text-amber-500">{'★'.repeat(n)}<span className="text-gray-300">{'★'.repeat(5 - n)}</span></span>
      <span className="text-gray-500">{fmtRating(avg)}{count ? ` (${count})` : ''}</span>
    </span>
  );
}
