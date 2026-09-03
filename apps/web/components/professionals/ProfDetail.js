export default function ProfDetail({ prof, credentials, reviews, availability, badges }) {
  if (!prof) return null;
  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{prof.role}</h1>
        <p className="text-gray-700 mb-4">{prof.bio}</p>
        <div className="grid grid-cols-3 gap-4">
          <div><p className="text-sm text-gray-600">District</p><p>{prof.location_district}</p></div>
          <div><p className="text-sm text-gray-600">Rating</p><p className="font-bold">{prof.average_rating || 'N/A'}</p></div>
          <div><p className="text-sm text-gray-600">Available</p><p>{prof.is_available_for_work ? 'Yes' : 'No'}</p></div>
        </div>
      </div>
      {credentials?.length > 0 && (
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="font-bold text-lg mb-3">Credentials</h2>
          {credentials.map((c) => (
            <div key={c.id} className="border rounded p-2 mb-2">
              <p className="font-semibold">{c.credential_name}</p>
              <p className="text-sm text-gray-600">{c.credential_number}</p>
            </div>
          ))}
        </div>
      )}
      {reviews?.length > 0 && (
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="font-bold text-lg mb-3">Reviews ({reviews.length})</h2>
          {reviews.map((r) => (
            <div key={r.id} className="border rounded p-2 mb-2">
              <div className="flex justify-between">
                <span className="font-semibold">{r.rating}★</span>
                <span className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm">{r.review_text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
