import { NextResponse } from 'next/server';
import { getPool } from '@mm/db';
import { hashPassword, signAccess, ACCESS_COOKIE, ACCESS_TTL } from '@mm/auth';
import { isEmail, isStrongPassword } from '@/lib/validators';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const b = await request.json().catch(() => ({}));
  const role = ['patient', 'doctor', 'hospital_admin'].includes(b.role) ? b.role : 'patient';
  if (!isEmail(b.email) || !isStrongPassword(b.password)) {
    return NextResponse.json({ data: null, errors: ['invalid_input'] }, { status: 400 });
  }
  try {
    const { rows } = await getPool().query(
      `INSERT INTO users (role, full_name, email, password_hash) VALUES ($1,$2,$3,$4) RETURNING id, role, email`,
      [role, b.full_name || null, String(b.email).toLowerCase(), hashPassword(b.password)]);
    const user = rows[0];
    const token = signAccess(user);
    const res = NextResponse.json({ data: { token, user }, errors: null }, { status: 201 });
    res.cookies.set(ACCESS_COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production', maxAge: ACCESS_TTL });
    return res;
  } catch (err) {
    if (String(err.message).includes('unique') || String(err.message).includes('duplicate')) {
      return NextResponse.json({ data: null, errors: ['email_taken'] }, { status: 409 });
    }
    return NextResponse.json({ data: null, errors: ['register_failed'] }, { status: 400 });
  }
}
