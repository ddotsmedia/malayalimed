import { NextResponse } from 'next/server';
import { listCamps } from '@/lib/camps';

export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({ data: await listCamps(), errors: null });
}
