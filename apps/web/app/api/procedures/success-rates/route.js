import { NextResponse } from 'next/server';
import { successRates } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET() { return NextResponse.json({ data: await successRates(), errors: null }); }
