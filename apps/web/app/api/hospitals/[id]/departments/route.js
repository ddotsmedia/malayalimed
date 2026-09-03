import { NextResponse } from 'next/server';
import { getHospDepts } from '@/lib/hospitals';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const data = await getHospDepts(params.id);
  return NextResponse.json({ data, errors: null });
}
