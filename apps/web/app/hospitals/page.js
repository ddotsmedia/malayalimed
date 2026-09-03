import { listHosps } from '@/lib/hospitals';
import HospCard from '@/components/hospitals/HospCard';

export const metadata = { title: 'Hospitals in Kerala', description: 'Find and compare hospitals in Kerala' };

export default async function HospPage() {
  const hosps = await listHosps(20, 0);
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Hospitals</h1>
        <p className="text-gray-600 mb-8">Find hospitals by location, services, and ratings</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hosps.map((h) => (
            <a key={h.id} href={`/hospitals/${h.id}`}>
              <HospCard hosp={h} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
