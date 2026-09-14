'use client';
import { useState, useEffect } from 'react';

export default function ShiftsPage() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [district, setDistrict] = useState('');

  useEffect(() => {
    const fetchShifts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          district: district || '',
          limit: 100,
        });
        const res = await fetch(`/api/shifts/list?${params}`);
        if (res.ok) {
          const { data } = await res.json();
          setShifts(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch shifts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShifts();
  }, [district]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Available Shifts</h1>
        <p className="text-gray-600 mb-8">Find and fill open hospital shifts</p>

        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <input
            type="text"
            placeholder="Filter by district..."
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-600 py-8">Loading...</p>
        ) : shifts.length > 0 ? (
          <div className="space-y-4">
            {shifts.map((s) => (
              <div key={s.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Shift Type</p>
                    <p className="font-bold">{s.shift_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Specialty</p>
                    <p className="font-bold">{s.specialty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-bold">{new Date(s.shift_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Positions</p>
                    <p className="font-bold">{s.filled_staff}/{s.required_staff}</p>
                  </div>
                  <div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                      Book Shift
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-8">No shifts available</p>
        )}
      </div>
    </div>
  );
}
