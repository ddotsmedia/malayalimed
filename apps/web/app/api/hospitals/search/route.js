import { NextResponse } from 'next/server';
import { searchHosps } from '@/lib/hospitals';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const limit = parseInt(searchParams.get('limit') || '20');
  const page = parseInt(searchParams.get('page') || '1');
  const offset = (page - 1) * limit;
  if (!q) return NextResponse.json({ errors: ['q parameter required'] }, { status: 400 });
  const data = await searchHosps(q, limit, offset);
  return NextResponse.json({ data, errors: null });
}
