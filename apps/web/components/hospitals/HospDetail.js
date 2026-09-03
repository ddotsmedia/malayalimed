export default function HospDetail({ hosp, depts, services, facilities, beds, staff }) {
  if (!hosp) return null;
  return (
    <div className="max-w-5xl space-y-6">
      <div className="bg-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">{hosp.name_en}</h1>
        {hosp.name_ml && <p className="text-lg text-gray-600 mb-4">{hosp.name_ml}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-sm text-gray-600">Location</p><p>{hosp.district}</p></div>
          <div><p className="text-sm text-gray-600">Rating</p><p className="font-bold">{hosp.average_rating || 'N/A'}</p></div>
        </div>
      </div>
      {beds && beds.length > 0 && (
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Bed Availability</h2>
          <div className="space-y-3">
            {beds.map((b) => {
              const pct = (b.available_beds / b.total_beds) * 100;
              return (
                <div key={b.id}>
                  <div className="flex justify-between mb-1"><span>{b.bed_type}</span><span className="text-sm">{b.available_beds}/{b.total_beds}</span></div>
                  <div className="bg-gray-200 rounded h-2"><div className="bg-green-500 h-2 rounded" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {depts && depts.length > 0 && (
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Departments</h2>
          {depts.map((d) => (
            <div key={d.id} className="border rounded p-3 mb-2">
              <p className="font-semibold">{d.department_name}</p>
              <p className="text-sm text-gray-600">{d.specialty} · {d.staff_count} staff</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
