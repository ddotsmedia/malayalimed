import { NextResponse } from 'next/server';
import { one } from '@mm/db';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { id } = await params;
  const row = await one(
    `SELECT d.*, s.name_en AS specialty_en, di.name_en AS district_en
       FROM doctors d LEFT JOIN specialties s ON s.id=d.specialty_id LEFT JOIN districts di ON di.id=d.district_id
      WHERE (d.id::text=$1 OR d.slug=$1) AND d.deleted_at IS NULL`, [id]);
  if (!row) return NextResponse.json({ data: null, errors: ['not_found'] }, { status: 404 });
  return NextResponse.json({ data: row, errors: null });
}
