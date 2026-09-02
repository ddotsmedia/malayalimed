import { NextResponse } from 'next/server';
import { templates } from '@/lib/resumes';
export const dynamic = 'force-dynamic';
export async function GET() { return NextResponse.json({ data: await templates(), errors: null }); }
