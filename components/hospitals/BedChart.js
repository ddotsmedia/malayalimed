export default function BedChart({ beds }) {
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Bed Availability</h2>
      <div className="space-y-4">
        {beds?.map((b) => {
          const pct = (b.available_beds / b.total_beds) * 100;
          return (
            <div key={b.id}>
              <div className="flex justify-between mb-1">
                <span className="font-semibold">{b.bed_type}</span>
                <span className="text-sm text-gray-600">
                  {b.available_beds}/{b.total_beds}
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-3">Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  );
}
