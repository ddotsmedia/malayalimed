import { NextResponse } from 'next/server';
import { urgentCare } from '@/lib/emergency';

export const dynamic = 'force-dynamic';
export async function GET(request) {
  const district = new URL(request.url).searchParams.get('district');
  return NextResponse.json({ data: await urgentCare(district), errors: null });
}
