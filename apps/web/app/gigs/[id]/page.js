'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function GigDetail() {
  const params = useParams();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await fetch(`/api/gigs/${params.id}`);
        if (res.ok) {
          const { data } = await res.json();
          setGig(data);
        }
      } catch (err) {
        console.error('Failed to fetch gig:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [params.id]);

  const handleBook = async () => {
    setBooking(true);
    try {
      const profId = localStorage.getItem('profId') || 'user-id';
      const res = await fetch('/api/gigs/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gig_id: params.id,
          professional_id: profId,
        }),
      });

      if (res.ok) {
        setMessage('Successfully booked! You will be contacted soon.');
      } else {
        setMessage('Failed to book gig');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!gig) return <div className="p-6">Gig not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{gig.gig_title}</h1>
      <p className="text-gray-600 mb-6">{gig.description}</p>

      <div className="bg-white rounded-lg p-6 mb-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Specialization</p>
          <p className="font-bold">{gig.specialization}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Hourly Rate</p>
          <p className="font-bold">₹{gig.hourly_rate}/hr</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Duration</p>
          <p className="font-bold">{gig.duration_days} days</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Location</p>
          <p className="font-bold">{gig.location_district}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6">
        <p className="text-sm text-gray-600 mb-1">Start Date</p>
        <p className="font-bold mb-4">{new Date(gig.start_date).toLocaleDateString()}</p>
        <p className="text-sm text-gray-600 mb-1">End Date</p>
        <p className="font-bold">{new Date(gig.end_date).toLocaleDateString()}</p>
      </div>

      <button
        onClick={handleBook}
        disabled={booking}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold"
      >
        {booking ? 'Booking...' : 'Book This Gig'}
      </button>

      {message && (
        <p className={`mt-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
