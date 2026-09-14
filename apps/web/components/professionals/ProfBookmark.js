'use client';
import { useState } from 'react';

export default function ProfBookmark({ profId }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBookmark = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId') || 'anonymous';
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          professional_id: profId,
          bookmark_type: 'favorite',
        }),
      });

      if (res.ok) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (err) {
      console.error('Bookmark error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        isBookmarked
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      } disabled:opacity-50`}
    >
      {isBookmarked ? '❤️ Bookmarked' : '🤍 Bookmark'}
    </button>
  );
}
