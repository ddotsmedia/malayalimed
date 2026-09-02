import { NextResponse } from 'next/server';
import { interpretTest } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET(request, { params }) { const { id } = await params; const value = new URL(request.url).searchParams.get('value'); const res = await interpretTest(id, value); if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 404 }); return NextResponse.json({ data: res, errors: null }); }
