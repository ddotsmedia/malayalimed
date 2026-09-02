import { NextResponse } from 'next/server';
import { prices } from '@/lib/rxDelivery';

export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({ data: prices(), errors: null });
}
