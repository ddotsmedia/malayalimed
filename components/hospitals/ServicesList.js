export default function ServicesList({ services }) {
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services?.map((s) => (
          <div key={s.id} className="flex items-start gap-3 pb-3 border-b">
            <span className={`text-xl mt-1 ${s.available ? '✅' : '⏸️'}`} />
            <div>
              <p className="font-semibold">{s.service_name}</p>
              {s.description && <p className="text-sm text-gray-600">{s.description}</p>}
              <p className="text-xs text-gray-500 mt-1">{s.available ? 'Available' : 'Unavailable'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
