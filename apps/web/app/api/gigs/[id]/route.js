import { NextResponse } from 'next/server';
import { getGig, getGigBookings } from '@/lib/gigs';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const [gig, bookings] = await Promise.all([
      getGig(params.id),
      getGigBookings(params.id),
    ]);

    if (!gig) {
      return NextResponse.json(
        { data: null, errors: ['not_found'] },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: { ...gig, bookings },
      errors: null,
    });
  } catch (err) {
    return NextResponse.json(
      { data: null, errors: [err.message] },
      { status: 500 }
    );
  }
}
