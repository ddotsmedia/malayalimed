import { NextResponse } from 'next/server';
import { safeQuery } from '@mm/db';

export const dynamic = 'force-dynamic';

export async function DELETE(request, { params }) {
  try {
    const result = await safeQuery(
      `UPDATE bookmarks SET deleted_at=CURRENT_TIMESTAMP WHERE id=$1 RETURNING id`,
      [params.id]
    );

    if (!result.length) {
      return NextResponse.json(
        { data: null, errors: ['not_found'] },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: { deleted: true, id: params.id },
      errors: null,
    });
  } catch (err) {
    return NextResponse.json(
      { data: null, errors: [err.message] },
      { status: 500 }
    );
  }
}
