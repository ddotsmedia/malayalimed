'use client';
import { useState, useEffect } from 'react';
import HospCard from '@/components/hospitals/HospCard';

export default function HospPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    district: '',
    minRating: 0,
    minBeds: 0,
  });
  const [districts, setDistricts] = useState([]);

  // Load filter options
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const res = await fetch('/api/filters/districts');
        if (res.ok) {
          const { data } = await res.json();
          setDistricts(data || []);
        }
      } catch (err) {
        console.error('Failed to load districts:', err);
      }
    };
    loadFilters();
  }, []);

  // Load hospitals based on filters
  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          district: filters.district || '',
          minRating: filters.minRating || 0,
          minBeds: filters.minBeds || 0,
        });
        const res = await fetch(`/api/search/hospitals?${params}`);
        if (res.ok) {
          const { data } = await res.json();
          setHospitals(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch hospitals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Hospitals</h1>
        <p className="text-gray-600 mb-8">Find hospitals by location, services, and ratings</p>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">District</label>
            <select
              value={filters.district}
              onChange={(e) => setFilters({ ...filters, district: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <select
              value={filters.minRating}
              onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="0">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Minimum Beds</label>
            <input
              type="number"
              value={filters.minBeds}
              onChange={(e) => setFilters({ ...filters, minBeds: parseInt(e.target.value) || 0 })}
              min="0"
              step="50"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Min beds"
            />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <p className="text-center text-gray-600 py-8">Loading...</p>
        ) : hospitals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((h) => (
              <a key={h.id} href={`/hospitals/${h.id}`}>
                <HospCard hosp={h} />
              </a>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-8">No hospitals found matching your criteria</p>
        )}
      </div>
    </div>
  );
}
