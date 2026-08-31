import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { listPublishedQuestions, createQuestion } from '@/lib/qa';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const u = new URL(request.url).searchParams;
  const data = await listPublishedQuestions({ specialty: u.get('specialty') || '', page: Number(u.get('page')) || 1 });
  return NextResponse.json({ data, meta: { count: data.length }, errors: null });
}

export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const b = await request.json().catch(() => ({}));
  const res = await createQuestion({ patientId: s.userId, title: b.title, body: b.body, specialtyId: b.specialty_id, isAnonymous: b.is_anonymous });
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  const { evaluateBadges } = await import('@/lib/badges');
  evaluateBadges(s.userId).catch(() => {});
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
