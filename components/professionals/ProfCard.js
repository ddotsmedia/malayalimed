export default function ProfCard({ prof }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-lg">{prof.role || 'Healthcare Professional'}</h3>
          <p className="text-sm text-gray-600">{prof.specialties?.join(', ')}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="font-semibold">{prof.average_rating || 'N/A'}</span>
          </div>
          <p className="text-xs text-gray-500">{prof.location_district}</p>
        </div>
      </div>
      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{prof.bio}</p>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded ${prof.verification_status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {prof.verification_status}
        </span>
        {prof.is_available_for_work && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Available</span>}
      </div>
      {prof.badges?.length > 0 && (
        <div className="flex gap-1 mt-3 flex-wrap">
          {prof.badges.map((b) => (
            <span key={b} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {b}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
