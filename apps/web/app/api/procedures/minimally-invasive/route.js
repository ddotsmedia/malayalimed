import { NextResponse } from 'next/server';
import { minimallyInvasive } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET() { return NextResponse.json({ data: await minimallyInvasive(), errors: null }); }
