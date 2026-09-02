import { NextResponse } from 'next/server';
import { requireDoctor } from '@/lib/doctorAuth';
import { priorAuthStatus } from '@/lib/insurance';

export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  const s = await requireDoctor();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { id } = await params;
  const data = await priorAuthStatus(id);
  if (!data) return NextResponse.json({ errors: ['not_found'] }, { status: 404 });
  return NextResponse.json({ data, errors: null });
}
