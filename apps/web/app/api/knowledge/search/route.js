import { NextResponse } from 'next/server';
import { universalSearch } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET(request) { const u = new URL(request.url).searchParams; const q = u.get('q') || ''; return NextResponse.json({ data: q ? await universalSearch(q, u.get('entity_type')) : [], errors: null }); }
