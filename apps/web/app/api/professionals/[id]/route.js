import { NextResponse } from 'next/server';
import { getProf, getProfCredentials, getProfReviews, getProfAvailability, getProfBadges } from '@/lib/professionals';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const [prof, credentials, reviews, availability, badges] = await Promise.all([
    getProf(params.id),
    getProfCredentials(params.id),
    getProfReviews(params.id, 10),
    getProfAvailability(params.id),
    getProfBadges(params.id),
  ]);
  if (!prof) return NextResponse.json({ errors: ['not found'] }, { status: 404 });
  return NextResponse.json({
    data: { prof, credentials, reviews, availability, badges },
    errors: null,
  });
}
