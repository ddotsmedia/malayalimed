import { NextResponse } from 'next/server';
import { atHomeTests, fastingTests } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET(request) { const mode = new URL(request.url).searchParams.get('mode'); return NextResponse.json({ data: mode === 'fasting' ? await fastingTests() : await atHomeTests(), errors: null }); }
