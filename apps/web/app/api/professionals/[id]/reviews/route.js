import { NextResponse } from 'next/server';
import { getProfReviews, addReview } from '@/lib/professionals';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const data = await getProfReviews(params.id, 20);
  return NextResponse.json({ data, errors: null });
}

export async function POST(request, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { rating, reviewText, category } = await request.json();
  if (!rating || !reviewText) return NextResponse.json({ errors: ['rating and reviewText required'] }, { status: 400 });
  const result = await addReview(params.id, session.userId, rating, reviewText, category);
  return NextResponse.json({ data: result[0], errors: null });
}
