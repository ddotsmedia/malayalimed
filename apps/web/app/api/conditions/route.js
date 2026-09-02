import { NextResponse } from 'next/server';
import { listConditions } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET(request) { const data = await listConditions(new URL(request.url).searchParams.get('page')); return NextResponse.json({ data, meta: { count: data.length }, errors: null }); }
