import { NextResponse } from 'next/server';
import { conditionProcs } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET(request, { params }) { const { slug } = await params; return NextResponse.json({ data: await conditionProcs(slug), errors: null }); }
