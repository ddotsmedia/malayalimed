// doctorRegistration.js — doctor self-registration + admin verification.
import { getPool, safeQuery, one } from '@mm/db';
import { hashPassword } from '@mm/auth';

const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90) || 'doctor';

export async function submitRegistration(d) {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // user
    const uRes = await client.query(
      `INSERT INTO users (role, full_name, email, password_hash, status)
       VALUES ('doctor',$1,lower($2),$3,'pending') RETURNING id`,
      [d.displayName, d.email, hashPassword(d.password)]);
    const userId = uRes.rows[0].id;
    // doctor
    const slug = slugify(d.displayName) + '-' + slugify(d.regNo);
    const dRes = await client.query(
      `INSERT INTO doctors (user_id, slug, display_name, specialty_id, district_id, reg_no, years_experience, consultation_fee, about_en, verification_status, listing_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending','draft') RETURNING id`,
      [userId, slug, d.displayName, d.specialtyId || null, d.districtId || null, d.regNo, d.yearsExperience || null, d.consultationFee || null, d.about || null]);
    const doctorId = dRes.rows[0].id;
    // registration record
    await client.query(
      `INSERT INTO doctor_registrations (user_id, doctor_id, email, phone, display_name, reg_no, specialty_id, district_id, years_experience, consultation_fee, about, education_json, status, submitted_at)
       VALUES ($1,$2,lower($3),$4,$5,$6,$7,$8,$9,$10,$11,$12,'submitted',now())`,
      [userId, doctorId, d.email, d.phone, d.displayName, d.regNo, d.specialtyId || null, d.districtId || null, d.yearsExperience || null, d.consultationFee || null, d.about || null, JSON.stringify(d.qualifications || [])]);
    await client.query('COMMIT');
    // NOTE: confirmation email is not sent — no email service (SES/Resend) configured.
    return { userId, doctorId, status: 'submitted' };
  } catch (err) {
    await client.query('ROLLBACK');
    const m = String(err.message);
    if (m.includes('unique_reg_no') || m.includes('reg_no')) return { error: 'reg_no_taken' };
    if (m.includes('unique') || m.includes('duplicate')) return { error: 'email_taken' };
    return { error: m.slice(0, 200) };
  } finally {
    client.release();
  }
}

export function listRegistrations(status) {
  const args = []; const where = ['1=1'];
  if (status) { args.push(status); where.push(`r.status=$${args.length}`); }
  return safeQuery(`SELECT r.id, r.email, r.phone, r.display_name, r.reg_no, r.status, r.nmc_verified, r.created_at, r.submitted_at,
      s.name_en AS specialty, di.name_en AS district, r.years_experience, r.consultation_fee, r.about, r.education_json, r.doctor_id
    FROM doctor_registrations r LEFT JOIN specialties s ON s.id=r.specialty_id LEFT JOIN districts di ON di.id=r.district_id
    WHERE ${where.join(' AND ')} ORDER BY r.created_at DESC LIMIT 200`, args);
}

export async function verifyRegistration(id, { nmcVerified, reason }) {
  const reg = await one('SELECT id, doctor_id, user_id FROM doctor_registrations WHERE id=$1', [id]);
  if (!reg) return { error: 'not_found' };
  const approved = nmcVerified === true;
  const regStatus = approved ? 'approved' : 'rejected';
  const docStatus = approved ? 'verified' : 'rejected';
  const pool = getPool();
  await pool.query('UPDATE doctor_registrations SET status=$2, nmc_verified=$3, rejection_reason=$4 WHERE id=$1',
    [id, regStatus, approved, approved ? null : (reason || 'Not verified')]);
  if (reg.doctor_id) {
    await pool.query(`UPDATE doctors SET verification_status=$2,
      listing_status=CASE WHEN $2='verified' THEN 'published' ELSE listing_status END, updated_at=now() WHERE id=$1`,
      [reg.doctor_id, docStatus]);
  }
  if (reg.user_id) {
    await pool.query('UPDATE users SET status=$2 WHERE id=$1', [reg.user_id, approved ? 'active' : 'inactive']).catch(() => {});
  }
  // NOTE: approval/rejection email not sent — no email service configured.
  return { ok: true, status: regStatus };
}
