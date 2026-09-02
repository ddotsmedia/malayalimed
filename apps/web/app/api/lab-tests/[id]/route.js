import { NextResponse } from 'next/server';
import { getTest } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET(request, { params }) { const { id } = await params; const data = await getTest(id); if (!data) return NextResponse.json({ errors: ['not_found'] }, { status: 404 }); return NextResponse.json({ data, errors: null }); }
