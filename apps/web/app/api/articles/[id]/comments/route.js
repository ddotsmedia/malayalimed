import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getPool, safeQuery } from '@mm/db';

export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  const { id } = await params;
  const data = await safeQuery('SELECT c.id, c.comment, c.created_at, u.full_name AS author FROM article_comments c LEFT JOIN users u ON u.id=c.user_id WHERE c.article_id=$1 ORDER BY c.created_at DESC', [id]);
  return NextResponse.json({ data, errors: null });
}
export async function POST(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const b = await request.json().catch(() => ({}));
  if (!b.comment) return NextResponse.json({ errors: ['comment_required'] }, { status: 400 });
  const { rows } = await getPool().query('INSERT INTO article_comments (article_id, user_id, comment) VALUES ($1,$2,$3) RETURNING id', [id, s.userId, String(b.comment).slice(0, 2000)]);
  return NextResponse.json({ data: { id: rows[0].id }, errors: null }, { status: 201 });
}
