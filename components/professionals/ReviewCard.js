export default function ReviewCard({ review }) {
  return (
    <div className="border rounded p-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
      </div>
      {review.category && <p className="text-xs text-blue-600 mb-1">{review.category}</p>}
      <p className="text-sm text-gray-700">{review.review_text}</p>
    </div>
  );
}
