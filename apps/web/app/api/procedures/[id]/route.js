import { NextResponse } from 'next/server';
import { getProc } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET(request, { params }) { const { id } = await params; const data = await getProc(id); if (!data) return NextResponse.json({ errors: ['not_found'] }, { status: 404 }); return NextResponse.json({ data, errors: null }); }
