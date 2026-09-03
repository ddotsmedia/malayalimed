import { NextResponse } from 'next/server';
import { getProfAvailability, setProfAvailability } from '@/lib/professionals';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const data = await getProfAvailability(params.id);
  return NextResponse.json({ data, errors: null });
}

export async function POST(request, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { openToLocum, openToFreelance, openToTelemedicine, openToFulltime } = await request.json();
  const result = await setProfAvailability(params.id, openToLocum, openToFreelance, openToTelemedicine, openToFulltime);
  return NextResponse.json({ data: result[0], errors: null });
}
