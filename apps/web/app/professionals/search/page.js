import { searchProfs } from '@/lib/professionals';
import ProfCard from '@/components/professionals/ProfCard';

export const metadata = { title: 'Search Professionals', description: 'Search healthcare professionals by specialty or location' };

export default async function SearchPage({ searchParams }) {
  const q = searchParams.q || '';
  const profs = q ? await searchProfs(q, 50, 0) : [];
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Search Professionals</h1>
        <div className="mb-8">
          <input type="text" placeholder="Search by name, specialty, district..." className="w-full p-3 border rounded-lg" defaultValue={q} />
        </div>
        {q && profs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profs.map((p) => (
              <a key={p.id} href={`/professionals/${p.id}`}>
                <ProfCard prof={p} />
              </a>
            ))}
          </div>
        ) : q ? (
          <p className="text-gray-600">No professionals found</p>
        ) : (
          <p className="text-gray-600">Enter a search term</p>
        )}
      </div>
    </div>
  );
}
