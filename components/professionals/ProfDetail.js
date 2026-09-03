import RatingStars from './RatingStars';
import CredentialBadge from './CredentialBadge';
import ReviewCard from './ReviewCard';
import AvailabilityBadge from './AvailabilityBadge';

export default function ProfDetail({ prof, credentials, reviews, availability, badges }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold">{prof.role}</h1>
            <p className="text-gray-600 text-lg">{prof.specialties?.join(', ')}</p>
          </div>
          <RatingStars rating={prof.average_rating} />
        </div>
        <p className="text-gray-700 mb-4">{prof.bio}</p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">District</p>
            <p className="font-semibold">{prof.location_district}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <AvailabilityBadge status={prof.verification_status} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Work Availability</p>
            <p>{prof.is_available_for_work ? 'Available' : 'Not available'}</p>
          </div>
        </div>
      </div>

      {badges?.length > 0 && (
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Badges</h2>
          <div className="flex flex-wrap gap-3">
            {badges.map((b) => (
              <div key={b.badge_type} className="text-center">
                <div className="text-3xl mb-1">{b.icon_url}</div>
                <p className="text-sm font-semibold">{b.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {credentials?.length > 0 && (
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Credentials</h2>
          <div className="space-y-3">
            {credentials.map((c) => (
              <CredentialBadge key={c.id} cred={c} />
            ))}
          </div>
        </div>
      )}

      {availability && (
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Work Preferences</h2>
          <div className="grid grid-cols-2 gap-3">
            {availability.open_to_locum && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">Open to Locum</span>}
            {availability.open_to_freelance && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">Open to Freelance</span>}
            {availability.open_to_telemedicine && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">Telemedicine</span>}
            {availability.open_to_fulltime && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">Open to Full-time</span>}
          </div>
        </div>
      )}

      {reviews?.length > 0 && (
        <div className="bg-white rounded-lg p-6">
          <h2 className="font-bold text-lg mb-4">Reviews ({reviews.length})</h2>
          <div className="space-y-4">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
