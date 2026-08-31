import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getPool } from '@mm/db';

export const dynamic = 'force-dynamic';
export async function POST(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const b = await request.json().catch(() => ({}));
  const rating = parseInt(b.rating, 10);
  if (!(rating >= 1 && rating <= 5)) return NextResponse.json({ errors: ['invalid_rating'] }, { status: 400 });
  await getPool().query('INSERT INTO article_ratings (article_id, user_id, rating) VALUES ($1,$2,$3) ON CONFLICT (article_id, user_id) DO UPDATE SET rating=$3', [id, s.userId, rating]);
  return NextResponse.json({ data: { ok: true }, errors: null }, { status: 201 });
}
