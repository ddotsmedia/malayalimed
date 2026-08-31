import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getPreferences, updatePreferences } from '@/lib/reminders';
import { reminderSchema, parse } from '@/lib/schemas/patient';

export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  return NextResponse.json({ data: await getPreferences(s.userId), errors: null });
}

export async function PUT(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const v = parse(reminderSchema, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  if (v.data.quietHoursStart && v.data.quietHoursEnd && v.data.quietHoursStart >= v.data.quietHoursEnd) {
    return NextResponse.json({ errors: ['quiet_hours_start must be before quiet_hours_end'] }, { status: 400 });
  }
  return NextResponse.json({ data: await updatePreferences(s.userId, v.data), errors: null });
}
