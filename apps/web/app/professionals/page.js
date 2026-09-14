'use client';
import { useState, useEffect } from 'react';
import ProfCard from '@/components/professionals/ProfCard';

export default function ProfsPage() {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    specialty: '',
    district: '',
    minRating: 0,
    availableNow: false,
  });
  const [specialties, setSpecialties] = useState([]);
  const [districts, setDistricts] = useState([]);

  // Load filter options
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [specRes, distRes] = await Promise.all([
          fetch('/api/filters/specialties'),
          fetch('/api/filters/districts'),
        ]);
        if (specRes.ok) {
          const { data } = await specRes.json();
          setSpecialties(data || []);
        }
        if (distRes.ok) {
          const { data } = await distRes.json();
          setDistricts(data || []);
        }
      } catch (err) {
        console.error('Failed to load filters:', err);
      }
    };
    loadFilters();
  }, []);

  // Load professionals based on filters
  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          specialty: filters.specialty || '',
          district: filters.district || '',
          minRating: filters.minRating || 0,
          availableNow: filters.availableNow || false,
        });
        const res = await fetch(`/api/search/professionals?${params}`);
        if (res.ok) {
          const { data } = await res.json();
          setProfessionals(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch professionals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionals();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Healthcare Professionals</h1>
        <p className="text-gray-600 mb-8">Find and connect with verified healthcare professionals</p>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Specialty</label>
            <select
              value={filters.specialty}
              onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">All Specialties</option>
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

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

          <div className="flex items-end">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.availableNow}
                onChange={(e) => setFilters({ ...filters, availableNow: e.target.checked })}
                className="w-4 h-4 mr-2"
              />
              <span className="text-sm">Available Now</span>
            </label>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <p className="text-center text-gray-600 py-8">Loading...</p>
        ) : professionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((p) => (
              <a key={p.id} href={`/professionals/${p.id}`}>
                <ProfCard prof={p} />
              </a>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-8">No professionals found matching your criteria</p>
        )}
      </div>
    </div>
  );
}
