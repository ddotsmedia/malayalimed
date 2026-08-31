import { NextResponse } from 'next/server';
import { doctorSlots } from '@/lib/appointmentsExtra';

export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  const { id } = await params;
  const date = new URL(request.url).searchParams.get('date');
  const data = await doctorSlots(id, date);
  return NextResponse.json({ data, errors: null });
}
