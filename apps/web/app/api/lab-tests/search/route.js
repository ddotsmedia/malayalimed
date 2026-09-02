import { NextResponse } from 'next/server';
import { searchTests } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET(request) { const q = new URL(request.url).searchParams.get('q') || ''; return NextResponse.json({ data: q ? await searchTests(q) : [], errors: null }); }
