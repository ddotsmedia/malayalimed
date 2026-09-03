export default function AvailabilityBadge({ status }) {
  const colors = {
    verified: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return <span className={`text-xs px-2 py-1 rounded ${colors[status] || colors.pending}`}>{status}</span>;
}
