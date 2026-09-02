import { NextResponse } from 'next/server';
import { searchMeds } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET(request) { const q = new URL(request.url).searchParams.get('q') || ''; return NextResponse.json({ data: q ? await searchMeds(q) : [], errors: null }); }
