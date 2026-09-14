import { NextResponse } from 'next/server';
import { safeQuery } from '@mm/db';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { user_id, professional_id, hospital_id, bookmark_type } =
      await request.json();

    if (!user_id || (!professional_id && !hospital_id)) {
      return NextResponse.json(
        { data: null, errors: ['missing_fields'] },
        { status: 400 }
      );
    }

    const result = await safeQuery(
      `INSERT INTO bookmarks (user_id, professional_id, hospital_id, bookmark_type, created_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, professional_id, hospital_id) DO NOTHING
       RETURNING id, user_id, professional_id, hospital_id, bookmark_type, created_at`,
      [user_id, professional_id || null, hospital_id || null, bookmark_type || 'favorite']
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
  const user_id = searchParams.get('user_id');

  if (!user_id) {
    return NextResponse.json({ data: [], errors: null });
  }

  try {
    const bookmarks = await safeQuery(
      `SELECT id, user_id, professional_id, hospital_id, bookmark_type, created_at
       FROM bookmarks
       WHERE user_id=$1 AND deleted_at IS NULL
       ORDER BY created_at DESC`,
      [user_id]
    );

    return NextResponse.json({ data: bookmarks, errors: null });
  } catch (err) {
    return NextResponse.json(
      { data: null, errors: [err.message] },
      { status: 500 }
    );
  }
}
