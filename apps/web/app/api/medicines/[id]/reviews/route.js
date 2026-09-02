import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { medReviews, addReview } from '@/lib/knowledge';
import { reviewSchema, parse } from '@/lib/schemas/batch19';
export const dynamic = 'force-dynamic';
export async function GET(request, { params }) { const { id } = await params; return NextResponse.json({ data: await medReviews(id), errors: null }); }
export async function POST(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const v = parse(reviewSchema, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  return NextResponse.json({ data: await addReview(id, s.userId, v.data), errors: null }, { status: 201 });
}
