import { NextResponse } from 'next/server';
import { procRisks } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET(request, { params }) { const { id } = await params; return NextResponse.json({ data: await procRisks(id), errors: null }); }
