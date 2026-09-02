import { NextResponse } from 'next/server';
import { featured } from '@/lib/jobsPortal';
export const dynamic = 'force-dynamic';
export async function GET() { return NextResponse.json({ data: await featured(), errors: null }); }
