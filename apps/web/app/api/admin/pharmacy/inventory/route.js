import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { listInventory, addInventory } from '@/lib/pharmacy';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  return NextResponse.json({ data: await listInventory(), errors: null });
}

export async function POST(request) {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const b = await request.json().catch(() => ({}));
  const res = await addInventory(b);
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
