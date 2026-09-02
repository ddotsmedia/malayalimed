import { NextResponse } from 'next/server';
import { trendingTests } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET() { return NextResponse.json({ data: await trendingTests(), errors: null }); }
