export default function HospCard({ hosp }) {
  if (!hosp) return null;
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <h3 className="font-semibold text-lg">{hosp.name_en}</h3>
      {hosp.name_ml && <p className="text-sm text-gray-600">{hosp.name_ml}</p>}
      <div className="flex justify-between items-center my-2">
        <span className="text-sm font-semibold">{hosp.average_rating || 'N/A'}</span>
        <span className="text-xs text-gray-500">{hosp.district}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
        <div className="bg-blue-50 p-1 rounded"><p className="text-gray-600">Beds</p><p className="font-bold">{hosp.beds_total}</p></div>
        <div className="bg-red-50 p-1 rounded"><p className="text-gray-600">ICU</p><p className="font-bold">{hosp.icu_beds}</p></div>
        <div className="bg-green-50 p-1 rounded"><p className="text-gray-600">General</p><p className="font-bold">{hosp.general_beds}</p></div>
      </div>
      {hosp.is_verified && <p className="text-xs text-green-600">Verified</p>}
    </div>
  );
}
