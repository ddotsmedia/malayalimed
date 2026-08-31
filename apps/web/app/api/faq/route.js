import { NextResponse } from 'next/server';
import { faq } from '@/lib/support';

export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({ data: await faq(), errors: null });
}
