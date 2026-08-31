import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { chat } from '@/lib/aiChat';
import { chatSchema, parse } from '@/lib/schemas/patient';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const s = await getSession();
  const v = parse(chatSchema, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await chat(s?.userId || null, v.data.message);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null });
}
