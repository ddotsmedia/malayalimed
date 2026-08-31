import { NextResponse } from 'next/server';
import { ambulanceContacts } from '@/lib/emergency';

export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({ data: await ambulanceContacts(), errors: null });
}
