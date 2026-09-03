export default function FacilityCard({ facility }) {
  const icons = {
    equipment: '🔧',
    lab: '🔬',
    imaging: '🖼️',
    pharmacy: '💊',
    other: '📋',
  };
  return (
    <div className="border rounded p-4 text-center">
      <div className="text-3xl mb-2">{icons[facility.facility_type] || icons.other}</div>
      <p className="font-semibold">{facility.facility_name}</p>
      <p className="text-sm text-gray-600">{facility.facility_type}</p>
      {facility.count > 0 && <p className="text-sm font-semibold text-blue-600 mt-1">{facility.count} units</p>}
    </div>
  );
}
