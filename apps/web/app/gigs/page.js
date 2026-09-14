'use client';
import { useState, useEffect } from 'react';

export default function GigsPage() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    specialization: '',
    district: '',
    minRate: 0,
  });

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          specialization: filters.specialization || '',
          district: filters.district || '',
          minRate: filters.minRate || 0,
        });
        const res = await fetch(`/api/gigs/search?${params}`);
        if (res.ok) {
          const { data } = await res.json();
          setGigs(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch gigs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Healthcare Gigs</h1>
        <p className="text-gray-600 mb-8">Find short-term gigs and temporary positions</p>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Specialization</label>
            <input
              type="text"
              placeholder="e.g. General Practice"
              value={filters.specialization}
              onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">District</label>
            <input
              type="text"
              placeholder="e.g. Kochi"
              value={filters.district}
              onChange={(e) => setFilters({ ...filters, district: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Minimum Hourly Rate</label>
            <input
              type="number"
              min="0"
              step="100"
              value={filters.minRate}
              onChange={(e) => setFilters({ ...filters, minRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="₹0"
            />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <p className="text-center text-gray-600 py-8">Loading...</p>
        ) : gigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((g) => (
              <a key={g.id} href={`/gigs/${g.id}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                  <h3 className="font-bold text-lg mb-2">{g.gig_title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{g.specialization}</p>
                  <div className="space-y-2 text-sm">
                    <div>📍 {g.location_district}</div>
                    <div>💰 ₹{g.hourly_rate}/hr</div>
                    <div>📅 {new Date(g.start_date).toLocaleDateString()} - {new Date(g.end_date).toLocaleDateString()}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-8">No gigs found matching your criteria</p>
        )}
      </div>
    </div>
  );
}
