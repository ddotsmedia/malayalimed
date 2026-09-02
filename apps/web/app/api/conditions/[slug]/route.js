import { NextResponse } from 'next/server';
import { getCondition } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET(request, { params }) { const { slug } = await params; const data = await getCondition(slug); if (!data) return NextResponse.json({ errors: ['not_found'] }, { status: 404 }); return NextResponse.json({ data, errors: null }); }
