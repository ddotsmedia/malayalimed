import { NextResponse } from 'next/server';
import { getProfCredentials } from '@/lib/professionals';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const data = await getProfCredentials(params.id);
  return NextResponse.json({ data, errors: null });
}
