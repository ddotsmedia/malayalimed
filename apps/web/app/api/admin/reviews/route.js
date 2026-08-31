import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { listReviewsAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const u = new URL(request.url).searchParams;
  const data = await listReviewsAdmin({ status: u.get('status'), rating: u.get('rating'), q: u.get('q'), page: Number(u.get('page')) || 1, limit: Number(u.get('limit')) || 50 });
  return NextResponse.json({ data, meta: { count: data.length }, errors: null });
}
