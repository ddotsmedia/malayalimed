export default function HospCard({ hosp }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="mb-2">
        <h3 className="font-semibold text-lg">{hosp.name_en}</h3>
        {hosp.name_ml && <p className="text-sm text-gray-600">{hosp.name_ml}</p>}
      </div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">{hosp.district}</span>
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <span className="font-semibold">{hosp.average_rating || 'N/A'}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
        <div className="bg-blue-50 p-2 rounded">
          <p className="text-xs text-gray-600">Total Beds</p>
          <p className="font-semibold">{hosp.beds_total}</p>
        </div>
        <div className="bg-red-50 p-2 rounded">
          <p className="text-xs text-gray-600">ICU Beds</p>
          <p className="font-semibold">{hosp.icu_beds}</p>
        </div>
        <div className="bg-green-50 p-2 rounded">
          <p className="text-xs text-gray-600">General</p>
          <p className="font-semibold">{hosp.general_beds}</p>
        </div>
      </div>
      {hosp.accreditations?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {hosp.accreditations.map((a) => (
            <span key={a} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {a}
            </span>
          ))}
        </div>
      )}
      {hosp.is_verified && <p className="text-xs text-green-600 mt-2">Verified Hospital</p>}
    </div>
  );
}
