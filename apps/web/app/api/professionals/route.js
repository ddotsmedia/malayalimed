import { NextResponse } from 'next/server';
import { listProfs, countProfs } from '@/lib/professionals';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;
  const [data, total] = await Promise.all([listProfs(limit, offset), countProfs()]);
  return NextResponse.json({
    data,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
    errors: null,
  });
}
