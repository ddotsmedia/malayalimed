import { NextResponse } from 'next/server';
import { trending } from '@/lib/jobsPortal';
export const dynamic = 'force-dynamic';
export async function GET() { return NextResponse.json({ data: await trending(), errors: null }); }
