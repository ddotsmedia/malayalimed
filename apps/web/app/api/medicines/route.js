import { NextResponse } from 'next/server';
import { listMeds } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET(request) { const page = new URL(request.url).searchParams.get('page'); const data = await listMeds(page); return NextResponse.json({ data, meta: { count: data.length }, errors: null }); }
