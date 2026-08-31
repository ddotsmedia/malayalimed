import { getPool, safeQuery } from '@mm/db';

export function certifications(doctorId) {
  return safeQuery('SELECT id, cert_name, issuing_body, issue_date, expiry_date FROM doctor_certifications WHERE doctor_id=$1 ORDER BY issue_date DESC', [doctorId]);
}
export async function addCertification(doctorId, { certName, issuingBody, issueDate, expiryDate }) {
  const { rows } = await getPool().query('INSERT INTO doctor_certifications (doctor_id, cert_name, issuing_body, issue_date, expiry_date) VALUES ($1,$2,$3,$4,$5) RETURNING id', [doctorId, certName, issuingBody || null, issueDate || null, expiryDate || null]);
  return { id: rows[0].id };
}
export function awards(doctorId) { return safeQuery('SELECT id, award_name, year, description FROM doctor_awards WHERE doctor_id=$1 ORDER BY year DESC', [doctorId]); }
export function publications(doctorId) { return safeQuery('SELECT id, title, journal, year, url FROM doctor_publications WHERE doctor_id=$1 ORDER BY year DESC', [doctorId]); }
export async function addAward(doctorId, b) { const { rows } = await getPool().query('INSERT INTO doctor_awards (doctor_id, award_name, year, description) VALUES ($1,$2,$3,$4) RETURNING id', [doctorId, b.awardName, parseInt(b.year, 10) || null, b.description || null]); return { id: rows[0].id }; }
export async function addPublication(doctorId, b) { const { rows } = await getPool().query('INSERT INTO doctor_publications (doctor_id, title, journal, year, url) VALUES ($1,$2,$3,$4,$5) RETURNING id', [doctorId, b.title, b.journal || null, parseInt(b.year, 10) || null, b.url || null]); return { id: rows[0].id }; }
