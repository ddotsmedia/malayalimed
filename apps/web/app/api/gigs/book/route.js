import { NextResponse } from 'next/server';
import { bookGig } from '@/lib/gigs';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { gig_id, professional_id } = await request.json();

    if (!gig_id || !professional_id) {
      return NextResponse.json(
        { data: null, errors: ['missing_fields'] },
        { status: 400 }
      );
    }

    const result = await bookGig(gig_id, professional_id);

    return NextResponse.json({
      data: result[0] || null,
      errors: null,
    });
  } catch (err) {
    return NextResponse.json(
      { data: null, errors: [err.message] },
      { status: 500 }
    );
  }
}
