export default function ProfCard({ prof }) {
  if (!prof) return null;
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <h3 className="font-semibold text-lg">{prof.role || 'Professional'}</h3>
      <p className="text-sm text-gray-600">{prof.specialties?.join(', ')}</p>
      <div className="flex justify-between items-center my-2">
        <span className="text-sm font-semibold">{prof.average_rating || 'N/A'}</span>
        <span className="text-xs text-gray-500">{prof.location_district}</span>
      </div>
      <p className="text-sm text-gray-700 mb-2 line-clamp-2">{prof.bio}</p>
      <span className={`text-xs px-2 py-1 rounded ${prof.verification_status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
        {prof.verification_status}
      </span>
    </div>
  );
}
