import { listProfs } from '@/lib/professionals';
import ProfCard from '@/components/professionals/ProfCard';

export const metadata = { title: 'Healthcare Professionals', description: 'Find verified healthcare professionals in Kerala' };

export default async function ProfsPage() {
  const profs = await listProfs(20, 0);
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Healthcare Professionals</h1>
        <p className="text-gray-600 mb-8">Find and connect with verified healthcare professionals</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profs.map((p) => (
            <a key={p.id} href={`/professionals/${p.id}`}>
              <ProfCard prof={p} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
