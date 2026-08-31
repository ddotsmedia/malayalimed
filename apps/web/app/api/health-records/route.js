import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { listRecords, addRecord } from '@/lib/healthRecords';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const type = new URL(request.url).searchParams.get('type') || '';
  const data = await listRecords(s.userId, type);
  return NextResponse.json({ data, meta: { count: data.length }, errors: null });
}

export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const b = await request.json().catch(() => ({}));
  const res = await addRecord(s.userId, {
    recordType: b.record_type, title: b.title, description: b.description,
    recordDate: b.record_date, doctorName: b.doctor_name, hospitalName: b.hospital_name
  });
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
