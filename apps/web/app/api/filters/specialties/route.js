import { NextResponse } from 'next/server';
import { getDistinctSpecialties } from '@/lib/professionals';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const results = await getDistinctSpecialties();
    const specialties = results.map((r) => r.specialty).filter(Boolean);
    return NextResponse.json({ data: specialties, errors: null });
  } catch (err) {
    return NextResponse.json(
      { data: [], errors: [err.message] },
      { status: 500 }
    );
  }
}
