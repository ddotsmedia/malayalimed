import { getProf, getProfCredentials, getProfReviews, getProfAvailability, getProfBadges } from '@/lib/professionals';
import ProfDetail from '@/components/professionals/ProfDetail';

export async function generateMetadata({ params }) {
  const prof = await getProf(params.id);
  return {
    title: `${prof?.role} - Healthcare Professional`,
    description: prof?.bio || 'Professional profile',
  };
}

export default async function ProfPage({ params }) {
  const [prof, credentials, reviews, availability, badges] = await Promise.all([
    getProf(params.id),
    getProfCredentials(params.id),
    getProfReviews(params.id, 5),
    getProfAvailability(params.id),
    getProfBadges(params.id),
  ]);

  if (!prof) {
    return <div className="text-center py-20">Professional not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="px-4">
        <ProfDetail prof={prof} credentials={credentials} reviews={reviews} availability={availability} badges={badges} />
      </div>
    </div>
  );
}
