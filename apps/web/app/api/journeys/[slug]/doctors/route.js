import { NextResponse } from 'next/server';
import { journeyDoctors } from '@/lib/journeys';

export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  const { slug } = await params;
  return NextResponse.json({ data: await journeyDoctors(slug), errors: null });
}
