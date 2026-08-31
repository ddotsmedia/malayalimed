import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { listReviews, createReview } from '@/lib/reviews';
import { reviewSchema } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

const entity = (u) => u.get('doctorId') ? { type: 'doctor', id: u.get('doctorId') } : u.get('hospitalId') ? { type: 'hospital', id: u.get('hospitalId') } : null;

export async function GET(request) {
  const u = new URL(request.url).searchParams;
  const e = entity(u);
  if (!e) return NextResponse.json({ errors: ['entity_required'] }, { status: 400 });
  const data = await listReviews(e.type, e.id, { page: Number(u.get('page')) || 1, limit: Number(u.get('limit')) || 10 });
  return NextResponse.json({ data, meta: { count: data.length }, errors: null });
}

export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const b = await request.json().catch(() => ({}));
  const entityType = b.doctorId ? 'doctor' : b.hospitalId ? 'hospital' : b.entity_type;
  const entityId = b.doctorId || b.hospitalId || b.entity_id;
  const v = reviewSchema.safeParse({ rating: b.rating, text: b.text ?? b.body, entityId });
  if (!v.success) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await createReview({ patientId: s.userId, entityType, entityId, rating: b.rating, title: b.title, body: b.text ?? b.body });
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
