import { searchHosps } from '@/lib/hospitals';
import HospCard from '@/components/hospitals/HospCard';

export const metadata = { title: 'Search Hospitals', description: 'Search hospitals by name or location' };

export default async function SearchPage({ searchParams }) {
  const q = searchParams.q || '';
  const hosps = q ? await searchHosps(q, 50, 0) : [];
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Search Hospitals</h1>
        <div className="mb-8">
          <input type="text" placeholder="Search by name, location, accreditation..." className="w-full p-3 border rounded-lg" defaultValue={q} />
        </div>
        {q && hosps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hosps.map((h) => (
              <a key={h.id} href={`/hospitals/${h.id}`}>
                <HospCard hosp={h} />
              </a>
            ))}
          </div>
        ) : q ? (
          <p className="text-gray-600">No hospitals found</p>
        ) : (
          <p className="text-gray-600">Enter a search term</p>
        )}
      </div>
    </div>
  );
}
