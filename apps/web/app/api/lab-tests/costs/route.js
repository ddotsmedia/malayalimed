import { NextResponse } from 'next/server';
import { testCosts } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET(request) { return NextResponse.json({ data: await testCosts(new URL(request.url).searchParams.get('test_ids')), errors: null }); }
