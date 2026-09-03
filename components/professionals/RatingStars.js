export default function RatingStars({ rating }) {
  if (!rating) return <p className="text-gray-400">No ratings yet</p>;
  const stars = Math.round(rating);
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < stars ? 'text-yellow-500' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
      <span className="font-semibold">{rating.toFixed(1)}</span>
    </div>
  );
}
