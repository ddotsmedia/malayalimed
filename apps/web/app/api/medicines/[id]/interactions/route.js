import { NextResponse } from 'next/server';
import { medInteractions } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET(request, { params }) { const { id } = await params; const withId = new URL(request.url).searchParams.get('with'); return NextResponse.json({ data: await medInteractions(id, withId), errors: null }); }
