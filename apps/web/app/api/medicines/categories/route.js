import { NextResponse } from 'next/server';
import { medForms } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET() { return NextResponse.json({ data: await medForms(), errors: null }); }
