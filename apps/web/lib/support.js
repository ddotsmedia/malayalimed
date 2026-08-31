import { getPool, safeQuery } from '@mm/db';

export function faq() { return safeQuery('SELECT id, question, answer, category FROM support_faq ORDER BY sort, question'); }
export async function submitSupport(userId, { kind, name, email, message }) {
  const { rows } = await getPool().query('INSERT INTO support_messages (user_id, kind, name, email, message) VALUES ($1,$2,$3,$4,$5) RETURNING id', [userId || null, kind, name || null, email || null, message]);
  return { id: rows[0].id };
}
