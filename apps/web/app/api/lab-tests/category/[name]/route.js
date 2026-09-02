import { NextResponse } from 'next/server';
import { testsByCategory } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET(request, { params }) { const { name } = await params; return NextResponse.json({ data: await testsByCategory(decodeURIComponent(name)), errors: null }); }
