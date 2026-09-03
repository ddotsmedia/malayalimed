import { NextResponse } from 'next/server';
import { getBedAvailability, updateBedAvailability } from '@/lib/hospitals';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const data = await getBedAvailability(params.id);
  return NextResponse.json({ data, errors: null });
}

export async function POST(request, { params }) {
  const session = await getSession();
  if (!session || session.role !== 'hospital_admin') return NextResponse.json({ errors: ['unauthorized'] }, { status: 403 });
  const { bedType, availableBeds } = await request.json();
  if (!bedType || availableBeds === undefined) return NextResponse.json({ errors: ['bedType and availableBeds required'] }, { status: 400 });
  const result = await updateBedAvailability(params.id, bedType, availableBeds);
  return NextResponse.json({ data: result[0], errors: null });
}
