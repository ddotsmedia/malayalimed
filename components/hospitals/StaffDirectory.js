export default function StaffDirectory({ staff }) {
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Staff Directory ({staff?.length || 0})</h2>
      <div className="space-y-3">
        {staff?.map((s) => (
          <div key={s.id} className="border rounded p-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{s.position}</p>
                <p className="text-sm text-gray-600">{s.role}</p>
                {s.specialties && <p className="text-xs text-blue-600">{s.specialties.join(', ')}</p>}
              </div>
              {s.average_rating && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold text-sm">{s.average_rating}</span>
                </div>
              )}
            </div>
            {s.department && <p className="text-xs text-gray-500 mt-2">{s.department}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
