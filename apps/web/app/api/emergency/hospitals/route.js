import { NextResponse } from 'next/server';
import { emergencyHospitals } from '@/lib/emergency';

export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({ data: await emergencyHospitals(), errors: null });
}
