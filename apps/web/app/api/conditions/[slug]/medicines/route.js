import { NextResponse } from 'next/server';
import { conditionMeds } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET(request, { params }) { const { slug } = await params; return NextResponse.json({ data: await conditionMeds(slug), errors: null }); }
