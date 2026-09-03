import { NextResponse } from 'next/server';
import { trendingProfs } from '@/lib/professionals';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const limit = parseInt(new URL(request.url).searchParams.get('limit') || '10');
  const data = await trendingProfs(limit);
  return NextResponse.json({ data, errors: null });
}
