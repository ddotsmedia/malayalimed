import { NextResponse } from 'next/server';
import { listTherapists } from '@/lib/behavioral';

export const dynamic = 'force-dynamic';
export async function GET(request) {
  const spec = new URL(request.url).searchParams.get('specialization');
  return NextResponse.json({ data: await listTherapists(spec), errors: null });
}
