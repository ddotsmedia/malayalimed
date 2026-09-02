import { NextResponse } from 'next/server';
import { procsBySpecialty } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET(request, { params }) { const { specialty } = await params; return NextResponse.json({ data: await procsBySpecialty(decodeURIComponent(specialty)), errors: null }); }
