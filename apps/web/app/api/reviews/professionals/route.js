import { NextResponse } from 'next/server';
import { addProfReview, getProfReviews } from '@/lib/professionals';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { professional_id, reviewer_id, rating, review_text, category } =
      await request.json();

    if (!professional_id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { data: null, errors: ['invalid_data'] },
        { status: 400 }
      );
    }

    const result = await addProfReview(
      professional_id,
      reviewer_id || null,
      rating,
      review_text || '',
      category || 'general'
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
  const professional_id = searchParams.get('professional_id');

  if (!professional_id) {
    return NextResponse.json(
      { data: null, errors: ['missing_professional_id'] },
      { status: 400 }
    );
  }

  try {
    const reviews = await getProfReviews(professional_id, 50);
    return NextResponse.json({ data: reviews, errors: null });
  } catch (err) {
    return NextResponse.json(
      { data: null, errors: [err.message] },
      { status: 500 }
    );
  }
}
