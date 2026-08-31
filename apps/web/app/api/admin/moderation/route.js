import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { moderationQueue } from '@/lib/moderation';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  return NextResponse.json({ data: await moderationQueue(), errors: null });
}
