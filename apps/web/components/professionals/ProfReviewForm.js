'use client';
import { useState } from 'react';

export default function ProfReviewForm({ profId }) {
  const [rating, setRating] = useState('5');
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!rating || !review.trim()) {
      setMessage('Please provide both rating and review text');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews/professionals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professional_id: profId,
          reviewer_id: null,
          rating: parseInt(rating),
          review_text: review,
          category: 'general',
        }),
      });

      if (res.ok) {
        setMessage('Review submitted successfully!');
        setReview('');
        setRating('5');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to submit review');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Write a Review</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="1">⭐ 1 - Poor</option>
            <option value="2">⭐ 2 - Fair</option>
            <option value="3">⭐ 3 - Good</option>
            <option value="4">⭐ 4 - Very Good</option>
            <option value="5">⭐ 5 - Excellent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Your Review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience..."
            className="w-full px-3 py-2 border rounded-lg"
            rows="4"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>

        {message && (
          <p className={message.includes('success') ? 'text-green-600' : 'text-red-600'}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
