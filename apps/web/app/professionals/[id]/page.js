import { getProf, getProfCredentials, getProfReviews, getProfAvailability, getProfBadges } from '@/lib/professionals';
import ProfDetail from '@/components/professionals/ProfDetail';
import ProfReviewForm from '@/components/professionals/ProfReviewForm';
import ProfBookmark from '@/components/professionals/ProfBookmark';

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
    getProfReviews(params.id, 10),
    getProfAvailability(params.id),
    getProfBadges(params.id),
  ]);

  if (!prof) {
    return <div className="text-center py-20">Professional not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <ProfDetail prof={prof} credentials={credentials} reviews={reviews} availability={availability} badges={badges} />
          </div>
          <ProfBookmark profId={prof.id} />
        </div>
        <ProfReviewForm profId={prof.id} />
      </div>
    </div>
  );
}
