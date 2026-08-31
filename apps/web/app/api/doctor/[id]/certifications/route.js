import { NextResponse } from 'next/server';
import { certifications, awards, publications } from '@/lib/credentials';

export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  const { id } = await params;
  const [certs, aw, pubs] = await Promise.all([certifications(id), awards(id), publications(id)]);
  return NextResponse.json({ data: { certifications: certs, awards: aw, publications: pubs }, errors: null });
}
