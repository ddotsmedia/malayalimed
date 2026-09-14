import { NextResponse } from 'next/server';
import { addHospReview, getHospReviews } from '@/lib/hospitals';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { hospital_id, reviewer_id, rating, review_text } =
      await request.json();

    if (!hospital_id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { data: null, errors: ['invalid_data'] },
        { status: 400 }
      );
    }

    const result = await addHospReview(
      hospital_id,
      reviewer_id || null,
      rating,
      review_text || ''
    );

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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const hospital_id = searchParams.get('hospital_id');

  if (!hospital_id) {
    return NextResponse.json(
      { data: null, errors: ['missing_hospital_id'] },
      { status: 400 }
    );
  }

  try {
    const reviews = await getHospReviews(hospital_id, 50);
    return NextResponse.json({ data: reviews, errors: null });
  } catch (err) {
    return NextResponse.json(
      { data: null, errors: [err.message] },
      { status: 500 }
    );
  }
}
